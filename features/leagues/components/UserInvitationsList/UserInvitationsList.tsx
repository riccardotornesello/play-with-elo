import { Card, Grid, GridCol } from '@mantine/core';
import { League } from '../../models/league';
import { InviteAcceptFormButton } from '@/features/leagues/components/InviteAcceptFormButton/InviteAcceptFormButton';
import { InviteRejectFormButton } from '@/features/leagues/components/InviteRejectFormButton/InviteRejectFormButton';

export type UserInvitationsListProps = {
  leagues: League[];
};

export function UserInvitationsList({ leagues }: UserInvitationsListProps) {
  return (
    <Card shadow="sm" padding="md">
      {leagues.map((league) => (
        <Grid key={league._id}>
          <GridCol span={6}>{league.name}</GridCol>
          <GridCol span={6}>
            <InviteAcceptFormButton leagueId={league._id} />
            <InviteRejectFormButton leagueId={league._id} />
          </GridCol>
        </Grid>
      ))}
    </Card>
  );
}
