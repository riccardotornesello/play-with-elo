import { Box, Grid, GridCol } from '@mantine/core';
import { ILeague } from '../../models/league';
import { InviteAcceptFormButton } from '@/features/leagues/components/InviteAcceptFormButton/InviteAcceptFormButton';
import { InviteRejectFormButton } from '@/features/leagues/components/InviteRejectFormButton/InviteRejectFormButton';

export type UserInvitationsListProps = {
  leagues: ILeague[];
};

export function UserInvitationsList({ leagues }: UserInvitationsListProps) {
  if (leagues.length == 0) {
    return <Box>You have no invitations</Box>;
  }

  return (
    <Box>
      {leagues.map((league) => (
        <Grid key={league._id.toString()}>
          <GridCol span={6}>{league.name}</GridCol>
          <GridCol span={6}>
            <InviteAcceptFormButton leagueId={league._id.toString()} />
            <InviteRejectFormButton leagueId={league._id.toString()} />
          </GridCol>
        </Grid>
      ))}
    </Box>
  );
}
