import { getUser } from '../../../../../features/auth/utils/user';
import mongoose from 'mongoose';
import dbConnect from '../../../../../lib/mongodb';
import { Player } from '../../../../../features/leagues/models/league';
import { IMatchCreate } from '../../../../../features/leagues/controllers/common';
import { matchCreateSchema } from '../../../../../features/leagues/schemas/matches';
import { calculateElo } from '../../../../../lib/elo';
import { getLeague } from '../../../../../features/leagues/controllers/league';
import { saveMatchAndPlayers } from '../../../../../features/leagues/controllers/match';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  // TODO: handle more than 2 users

  // Check authentication
  const user = await getUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Validate body
  const formData = await request.json();

  let body;
  try {
    body = matchCreateSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  await dbConnect();

  const participantPlayerIds = body.players.map((p) => p.playerId);

  const league = await getLeague(params.id, {
    players: 1,
  });

  // Check if the league exists
  if (!league) {
    return Response.json({ message: 'League not found' }, { status: 404 });
  }

  // Check if the user is an admin
  const admin = league.players.find(
    (player) => player.user.toString() === user._id.toString(),
  );
  if (!admin || !admin.isAdmin) {
    return Response.json({ message: 'Not an admin' }, { status: 403 });
  }

  // Check if the players exist
  // TODO: return in validation format
  if (
    league.players.filter((p) =>
      participantPlayerIds.includes(p._id.toString()),
    ).length !== participantPlayerIds.length
  ) {
    return Response.json({ message: 'Invalid players' }, { status: 400 });
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
    return Response.json(
      { message: 'League version mismatch' },
      { status: 409 },
    );
  }

  return Response.json({}, { status: 200 });
}
