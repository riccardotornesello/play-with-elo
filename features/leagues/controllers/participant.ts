import { League } from '../models/league';
import { Participant } from '../models/participant';

/***************************
 * Types
 ***************************/

export type IParticipantCreate = Pick<Participant, 'user' | 'teamName'>;

/***************************
 * Functions
 ***************************/

export function generateParticipantData(participant: IParticipantCreate, isAdmin = false) {
  return {
    ...participant,
    isAdmin,
    rating: 1500,
  };
}

export async function registerLeaguePlayer(league: League, player: IParticipantCreate) {
  league.participants.push(generateParticipantData(player));
  league.pendingInvitedUsers.pull(player.user);
  return await league.save();
}
