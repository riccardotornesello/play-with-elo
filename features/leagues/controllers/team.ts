import { League } from '../models/league';
import { Team } from '../models/team';

/***************************
 * Types
 ***************************/

export type ITeamCreate = Pick<Team, 'user' | 'teamName'>;

/***************************
 * Functions
 ***************************/

export function generateTeamData(team: ITeamCreate, isAdmin = false) {
  return {
    ...team,
    isAdmin,
    rating: 1500,
  };
}

export async function registerLeaguePlayer(league: League, team: ITeamCreate) {
  league.teams.push(generateTeamData(team));
  league.pendingInvitedUsers.pull(team.user);
  return await league.save();
}
