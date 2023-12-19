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
