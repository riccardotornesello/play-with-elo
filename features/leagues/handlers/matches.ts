// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Auth
import { getApiUser } from '../../auth/utils/user';
// Db
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import { Player } from '../models/league';
import { League, LeagueModel } from '../models/league';
import { IMatchCreate } from '../controllers/common';
// Schema
import { matchCreateSchema } from '../schemas/matches';
// Elo
import { calculateElo } from '../../../lib/elo';
import { getLeague } from '../controllers/league';
import { saveMatchAndPlayers } from '../controllers/match';

export async function matchCreateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: handle more than 2 users

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

  const participantPlayerIds = body.players.map((p) => p.playerId);

  const league = await getLeague(id, {
    players: 1,
  });

  // Check if the league exists
  if (!league) {
    res.status(404).json({ message: 'League not found' });
    return;
  }

  // Check if the user is an admin
  const admin = league.players.find(
    (player) => player.user.toString() === user._id.toString(),
  );
  if (!admin || !admin.isAdmin) {
    res.status(403).json({ message: 'Not an admin' });
    return;
  }

  // Check if the players exist
  // TODO: return in validation format
  if (
    league.players.filter((p) =>
      participantPlayerIds.includes(p._id.toString()),
    ).length !== participantPlayerIds.length
  ) {
    res.status(400).json({ message: 'Invalid players' });
    return;
  }

  // Calculate ELO
  const playersEloInfo = body.players.map((player) => {
    const playerData = league.players.find(
      (p) => p._id.toString() === player.playerId,
    );
    if (!playerData) {
      throw new Error('Player not found');
    }

    return {
      playerId: player.playerId,
      points: player.points,
      rating: playerData.rating,
    };
  });

  const newRatings = calculateElo({ players: playersEloInfo });

  // Create match
  const matchPlayersData = body.players.map((player) => {
    const playerData = league.players.find(
      (p) => p._id.toString() === player.playerId,
    );
    if (!playerData) {
      throw new Error('Player not found');
    }

    return {
      player: new mongoose.Types.ObjectId(player.playerId),
      points: player.points,
      ratingEarned: newRatings.get(player.playerId)! - playerData.rating,
    };
  });

  const newPlayerData: Player[] = league.players.map((playerData) => {
    // Check if the user is in the match
    const newRating = newRatings.get(playerData._id.toString());
    if (!newRating) {
      return playerData;
    }

    // Update stats about rating
    if (newRating > playerData.rating) {
      playerData.ratingWins += 1;
    } else if (newRating < playerData.rating) {
      playerData.ratingLosses += 1;
    } else {
      playerData.ratingDraws += 1;
    }

    // Find the player in the match
    const playerMatch = matchPlayersData.find(
      (p) => p.player.toString() === playerData._id.toString(),
    );
    if (!playerMatch) {
      throw new Error('Player match not found');
    }

    // Find the opponent in the match
    const opponentMatch = matchPlayersData.find(
      (p) => p.player.toString() !== playerData._id.toString(),
    );
    if (!opponentMatch) {
      throw new Error('Opponent match not found');
    }

    // Update stats about games
    if (playerMatch.points > opponentMatch.points) {
      playerData.gameWins += 1;
    } else if (playerMatch.points < opponentMatch.points) {
      playerData.gameLosses += 1;
    } else {
      playerData.gameDraws += 1;
    }

    // Update rating
    playerData.rating = newRating;

    return playerData;
  });

  const match: IMatchCreate = {
    players: matchPlayersData,
    playedAt: new Date(),
  };

  // Update matches and players in DB
  const updated = await saveMatchAndPlayers(
    league._id,
    league.__v,
    match,
    newPlayerData,
  );
  if (!updated) {
    res.status(409).json({ message: 'League version mismatch' });
    return;
  }

  res.status(200).json({});
}
