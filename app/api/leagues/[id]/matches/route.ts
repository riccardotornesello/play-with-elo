import { getSessionUser } from '@/features/authentication/utils/user';
import { ObjectId } from 'mongodb';
import { dbConnect } from '@/lib/mongodb';
import { matchCreateSchema } from '@/features/matches/schemas/matches';
import { calculateElo } from '@/lib/elo';
import { getLeague } from '@/features/leagues/controllers/league';
import { generateValidationError } from '@/lib/errors';
import { MatchCreateSchema } from '@/features/matches/schemas/matches';
import { createMatch } from '@/features/matches/controllers/match';
import { Team } from '@/features/leagues/models/team';

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
  const team = league.teams.find((team) => team.user.toString() === user._id.toString());
  if (!team || !team.isAdmin) {
    return Response.json({ message: 'Not an admin' }, { status: 403 });
  }

  // Check if the players exist
  const teamErrors = [];
  for (let i = 0; i < body.teams.length; i++) {
    const player = league.teams.find((p) => p._id.toString() === body.teams[i].teamId);
    if (!player) {
      teamErrors.push(
        generateValidationError(['teams', i.toString(), 'teamId'], 'Player not found')
      );
    }
  }
  if (teamErrors.length > 0) {
    return Response.json(teamErrors, { status: 400 });
  }

  // Calculate ELO
  const teamsDataForEloCalculation = body.teams.map((team) => {
    const teamData = league.teams.find((p) => p._id.toString() === team.teamId);
    if (!teamData) {
      throw new Error('Team not found');
    }

    return {
      playerId: team.teamId,
      points: team.points,
      rating: teamData.rating,
    };
  });

  const newRatings = calculateElo({ players: teamsDataForEloCalculation });

  // Create match
  const matchTeamsOutput = body.teams.map((team) => {
    const teamData = league.teams.find((p) => p._id.toString() === team.teamId);
    if (!teamData) {
      throw new Error('Player not found');
    }

    return {
      team: new ObjectId(team.teamId),
      points: team.points,
      ratingEarned: newRatings.get(team.teamId)! - teamData.rating,
    };
  });

  const newTeamsData = body.teams.map((team) => {
    const teamData = league.teams.find((p) => p._id.toString() === team.teamId);
    if (!teamData) {
      throw new Error('Player not found');
    }

    const newRating = newRatings.get(team.teamId);
    if (!newRating) {
      throw new Error('New rating not found');
    }

    const newData = {
      _id: teamData._id,
      rating: newRating,
      ratingWins: 0,
      ratingLosses: 0,
      ratingDraws: 0,
      gameWins: 0,
      gameLosses: 0,
      gameDraws: 0,
    };

    // Update stats about rating
    if (newRating > teamData.rating) {
      newData.ratingWins += 1;
    } else if (newRating < teamData.rating) {
      newData.ratingLosses += 1;
    } else {
      newData.ratingDraws += 1;
    }

    // Find the player in the match
    const matchScore = matchTeamsOutput.find((p) => p.team.toString() === teamData._id.toString());
    if (!matchScore) {
      throw new Error('matchScore not found');
    }

    // Find the opponent in the match
    const opponentScore = matchTeamsOutput.find(
      (p) => p.team.toString() !== teamData._id.toString()
    );
    if (!opponentScore) {
      throw new Error('opponentScore not found');
    }

    // Update stats about games
    if (matchScore.points > opponentScore.points) {
      teamData.gameWins += 1;
    } else if (matchScore.points < opponentScore.points) {
      teamData.gameLosses += 1;
    } else {
      teamData.gameDraws += 1;
    }

    return newData;
  });

  await createMatch(
    league,
    {
      scores: matchTeamsOutput,
      playedAt: body.date,
    },
    newTeamsData
  );

  return Response.json({}, { status: 200 });
}
