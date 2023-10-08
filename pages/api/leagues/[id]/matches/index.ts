// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
// Db
import mongoose from 'mongoose';
import dbConnect from '../../../../../lib/mongodb';
import {
  IMatchCreate,
  IPlayer,
  getLeaguePlayers,
  saveMatch,
  updatePlayers,
} from '../../../../../controllers/League';
// Schema
import { matchCreateSchema } from '../../../../../schemas/matches';
// Elo
import { calculateElo } from '../../../../../lib/elo';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: 'Missing league id' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // TODO: Check if the league exists
  // TODO: Check if user is league admin
  // TODO: Prevent multiple insertions in parallel
  // TODO: handle more than 2 users
  // TODO: check that the users exist

  let parsed;
  try {
    parsed = matchCreateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  const playersResultInfo = parsed.players;

  await dbConnect();

  const playersLeagueInfo = await getLeaguePlayers(
    id,
    playersResultInfo.map((p) => p.playerId),
  );
  if (playersLeagueInfo.length !== playersResultInfo.length) {
    throw new Error('Players not found');
  }

  const playersResultWithRating = playersResultInfo.map((player) => {
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
    players: playersResultInfo.map((player, index) => {
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

  const playerUpdates: IPlayer[] = playersLeagueInfo.map((player) => {
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

    // TODO: handle more than two players

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

  // TODO: use single transaction

  await saveMatch(id, match);
  await updatePlayers(id, playerUpdates);

  res.status(200).json({ message: 'Match saved' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return post(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
