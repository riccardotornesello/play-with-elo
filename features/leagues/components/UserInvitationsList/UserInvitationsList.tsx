import { Card } from '@mantine/core';
import { League } from '../../models/league';

export type UserInvitationsListProps = {
  leagues: League[];
};

export function UserInvitationsList({ leagues }: UserInvitationsListProps) {
  return (
    <Card>
      {leagues.map((league) => (
        <div key={league._id}>{league.name}</div>
      ))}
    </Card>
  );
}
