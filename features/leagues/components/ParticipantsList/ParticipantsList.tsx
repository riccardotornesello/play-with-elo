import { Table, TableTbody, TableThead, TableTd, TableTr, TableTh } from '@mantine/core';
import { Participant } from '../../models/participant';

export type ParticipantsListProps = {
  participants: Participant[];
};

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>Participant</TableTh>
          <TableTh>Points</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {participants.map((participant) => (
          <TableTr key={participant._id.toString()}>
            <TableTd>{participant.teamName}</TableTd>
            <TableTd>{participant.rating}</TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
}
