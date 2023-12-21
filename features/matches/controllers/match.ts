import { Match } from '@/features/leagues/models/match';
import { League } from '@/features/leagues/models/league';
import { Participant } from '@/features/leagues/models/participant';

/***************************
 * Types
 ***************************/

export type IMatchCreate = Pick<Match, 'scores' | 'playedAt'>;

/***************************
 * Functions
 ***************************/

export function createMatch(league: League, match: IMatchCreate, participants: any) {
  league.matches.push(match);

  for (let participant of participants) {
    const item = league.participants.id(participant._id);
    for (const [key, value] of Object.entries(participant)) {
      if (key !== '_id') {
        item[key] = value;
      }
    }
  }

  return league.save();
}
