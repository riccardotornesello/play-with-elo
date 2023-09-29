import mongoose from 'mongoose';

export type IInvitation = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  leagueId: mongoose.Types.ObjectId;
};

export type IInvitationCreate = Pick<IInvitation, 'userId' | 'leagueId'>;

export const invitationSchema = new mongoose.Schema<IInvitation>({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  leagueId: { type: mongoose.Schema.ObjectId, required: true },
});

export const Invitation =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>('Invitation', invitationSchema);

export async function createInvitation(invitation: IInvitationCreate) {
  return Invitation.create(invitation);
}
