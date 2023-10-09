// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Auth
import { getApiUser } from '../../auth/utils/user';
// Db
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import { Player } from '../models/league';
import { IMatchCreate } from '../controllers/common';
import { saveMatch } from '../controllers/match';
import { updatePlayers, getLeaguePlayers } from '../controllers/player';
import { getLeague } from '../controllers/league';
// Schema
import { matchCreateSchema } from '../schemas/matches';
// Elo
import { calculateElo } from '../../../lib/elo';

export async function matchCreateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: handle more than 2 users
  // TODO: check that the users exist

  // Check authentication
  const user = await getApiUser(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Check url parameters
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(500).json({ message: 'Missing league id' });
    return;
  }

  // Validate body
  let body;
  try {
    body = matchCreateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  const league = await getLeague(id);
  if (!league) {
    res.status(404).json({ message: 'League not found' });
    return;
  }

  // Check if the user is an admin
  const player = league.players.find(
    (player) => player.user.toString() === user._id.toString(),
  );
  if (!player || !player.isAdmin) {
    res.status(403).json({ message: 'Not an admin' });
    return;
  }

  const playersLeagueInfo = await getLeaguePlayers(
    id,
    body.players.map((p) => p.playerId),
  );
  if (playersLeagueInfo.length !== body.players.length) {
    res.status(400).json({ message: 'Invalid players' });
    return;
  }

  const playersResultWithRating = body.players.map((player) => {
    const playerData = playersLeagueInfo.find(
      (p) => p._id.toString() === player.playerId,
    );
    if (!playerData) {
      throw new Error('Player not found');
    }

    return {
      ...player,
      rating: playerData.rating,
    };
  });

  const newRatings = calculateElo({ players: playersResultWithRating });

  const match: IMatchCreate = {
    players: body.players.map((player, index) => {
      const playerData = playersLeagueInfo.find(
        (p) => p._id.toString() === player.playerId,
      );
      if (!playerData) {
        throw new Error('Player not found');
      }

      return {
        playerId: new mongoose.Types.ObjectId(player.playerId),
        points: player.points,
        ratingEarned: newRatings.get(player.playerId)! - playerData.rating,
      };
    }),
    playedAt: new Date(),
  };

  const playerUpdates: Player[] = playersLeagueInfo.map((player) => {
    const playerData = player;

    const newRating = newRatings.get(player._id.toString())!;
    playerData.rating = newRating;

    if (newRating > playerData.rating) {
      playerData.pointWins += 1;
    } else if (newRating < playerData.rating) {
      playerData.pointLosses += 1;
    } else {
      playerData.pointDraws += 1;
    }

    const playerMatch = match.players.find((p) => p.playerId === player._id);
    if (!playerMatch) {
      throw new Error('Player match not found');
    }

    const opponentMatch = match.players.find((p) => p.playerId !== player._id);
    if (!opponentMatch) {
      throw new Error('Opponent match not found');
    }

    if (playerMatch.points > opponentMatch.points) {
      playerData.gameWins += 1;
    } else if (playerMatch.points < opponentMatch.points) {
      playerData.gameLosses += 1;
    } else {
      playerData.gameDraws += 1;
    }

    return playerData;
  });

  await saveMatch(id, match);
  await updatePlayers(id, playerUpdates);

  res.status(200).json({ message: 'Match saved' });
}
