import { LeagueModel, League } from '../models/league';
import { IParticipantCreate, generateParticipantData } from './participant';

/***************************
 * Types
 ***************************/

export type ILeagueCreate = Pick<League, 'name' | 'description'>;

/***************************
 * Functions
 ***************************/

export async function createLeague(
  league: ILeagueCreate,
  participant: IParticipantCreate
): Promise<League> {
  const newLeague = new LeagueModel({
    ...league,
    participants: [generateParticipantData(participant, true)],
  });
  await newLeague.save();
  return newLeague;
}

export async function getUserLeagues(userId: string): Promise<League[]> {
  return await LeagueModel.find({ 'participants.user': userId });
}

export async function getLeague(id: string): Promise<League | null> {
  return await LeagueModel.findById(id);
}

export async function getLeagueInfo(id: string): Promise<League | null> {
  return await LeagueModel.findById(id).lean();
}
