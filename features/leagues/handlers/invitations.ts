// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Auth
import { getApiUser } from '../../auth/utils/user';
// Input validation
import {
  leagueInvitationCreateSchema,
  leagueInvitationAcceptSchema,
} from '../schemas/invitation';
// Database
import dbConnect from '../../../lib/mongodb';
import {
  createLeagueInvitation,
  removeInvitation,
} from '../controllers/invitation';
import { registerLeaguePlayer } from '../controllers/player';
import { getLeague } from '../controllers/league';
import { findUserByUsername } from '../../../features/auth/controllers/user';

export async function leagueInvitationCreateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
    body = leagueInvitationCreateSchema.parse(req.body);
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

  // Get the invited user
  const invitedUser = await findUserByUsername(body.username);
  if (!user) {
    // TODO: return error in input validation
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Check if the user is already in the league
  if (league.players.find((player) => player.user === invitedUser._id)) {
    // TODO: return error in input validation
    res.status(400).json({ message: 'User is already in the league' });
    return;
  }

  // Check if the user has already been invited
  if (league.invitations?.includes(invitedUser._id.toString())) {
    // TODO: return error in input validation
    res.status(400).json({ message: 'User has already been invited' });
    return;
  }

  // Create the invitation
  await createLeagueInvitation(id, invitedUser._id.toString());

  res.status(200).json({});
}

export async function leagueInvitationRejectHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check authentication
  const user = await getApiUser(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Check url parameters
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: 'Missing league id' });
    return;
  }

  await dbConnect();

  await removeInvitation(id, user._id.toString());

  res.status(200).json({ message: 'Success' });
}

export async function leagueInvitationAcceptHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: prevent double entry in players array
  // TODO: check that the invitation exists

  // Check authentication
  const user = await getApiUser(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Check url parameters
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: 'Missing league id' });
    return;
  }

  // Validate body
  let body;
  try {
    body = leagueInvitationAcceptSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  await registerLeaguePlayer(id, {
    user: user._id,
    teamName: body.teamName,
  });

  await removeInvitation(id, user._id.toString());

  res.status(200).json({ message: 'Success' });
}
