import { getSessionUser } from '@/features/authentication/utils/user';
import { ObjectId } from 'mongodb';
import { dbConnect } from '@/lib/mongodb';
import { matchCreateSchema } from '@/features/matches/schemas/matches';
import { calculateElo } from '@/lib/elo';
import { getLeague } from '@/features/leagues/controllers/league';
import { generateValidationError } from '@/lib/errors';
import { MatchCreateSchema } from '@/features/matches/schemas/matches';
import { createMatch } from '@/features/matches/controllers/match';
import { Participant } from '@/features/leagues/models/participant';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // TODO: handle more than 2 users

  await dbConnect();

  // Check authentication
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Validate body
  const formData = await request.json();

  let body: MatchCreateSchema;
  try {
    body = matchCreateSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  // Get the league
  const league = await getLeague(params.id);
  if (!league) {
    return Response.json({ message: 'League not found' }, { status: 404 });
  }

  // Check if the user is an admin
  const participant = league.participants.find(
    (participant) => participant.user.toString() === user._id.toString()
  );
  if (!participant || !participant.isAdmin) {
    return Response.json({ message: 'Not an admin' }, { status: 403 });
  }

  // Check if the players exist
  const participantErrors = [];
  for (let i = 0; i < body.participants.length; i++) {
    const player = league.participants.find(
      (p) => p._id.toString() === body.participants[i].participantId
    );
    if (!player) {
      participantErrors.push(
        generateValidationError(['participants', i.toString(), 'participantId'], 'Player not found')
      );
    }
  }
  if (participantErrors.length > 0) {
    return Response.json(participantErrors, { status: 400 });
  }

  // Calculate ELO
  const participantsDataForEloCalculation = body.participants.map((participant) => {
    const participantData = league.participants.find(
      (p) => p._id.toString() === participant.participantId
    );
    if (!participantData) {
      throw new Error('Participant not found');
    }

    return {
      playerId: participant.participantId,
      points: participant.points,
      rating: participantData.rating,
    };
  });

  const newRatings = calculateElo({ players: participantsDataForEloCalculation });

  // Create match
  const matchParticipantsOutput = body.participants.map((participant) => {
    const participantData = league.participants.find(
      (p) => p._id.toString() === participant.participantId
    );
    if (!participantData) {
      throw new Error('Player not found');
    }

    return {
      participant: new ObjectId(participant.participantId),
      points: participant.points,
      ratingEarned: newRatings.get(participant.participantId)! - participantData.rating,
    };
  });

  const newParticipantsData = body.participants.map((participant) => {
    const participantData = league.participants.find(
      (p) => p._id.toString() === participant.participantId
    );
    if (!participantData) {
      throw new Error('Player not found');
    }

    const newRating = newRatings.get(participant.participantId);
    if (!newRating) {
      throw new Error('New rating not found');
    }

    const newData = {
      _id: participantData._id,
      rating: newRating,
      ratingWins: 0,
      ratingLosses: 0,
      ratingDraws: 0,
      gameWins: 0,
      gameLosses: 0,
      gameDraws: 0,
    };

    // Update stats about rating
    if (newRating > participantData.rating) {
      newData.ratingWins += 1;
    } else if (newRating < participantData.rating) {
      newData.ratingLosses += 1;
    } else {
      newData.ratingDraws += 1;
    }

    // Find the player in the match
    const matchScore = matchParticipantsOutput.find(
      (p) => p.participant.toString() === participantData._id.toString()
    );
    if (!matchScore) {
      throw new Error('matchScore not found');
    }

    // Find the opponent in the match
    const opponentScore = matchParticipantsOutput.find(
      (p) => p.participant.toString() !== participantData._id.toString()
    );
    if (!opponentScore) {
      throw new Error('opponentScore not found');
    }

    // Update stats about games
    if (matchScore.points > opponentScore.points) {
      participantData.gameWins += 1;
    } else if (matchScore.points < opponentScore.points) {
      participantData.gameLosses += 1;
    } else {
      participantData.gameDraws += 1;
    }

    return newData;
  });

  await createMatch(
    league,
    {
      scores: matchParticipantsOutput,
      playedAt: body.date,
    },
    newParticipantsData
  );

  return Response.json({}, { status: 200 });
}
