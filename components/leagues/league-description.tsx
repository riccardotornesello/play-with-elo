import { Card, CardBody, Text, Heading } from '@chakra-ui/react';
import { ILeague } from '../../models/League';

export type LeagueDescriptionProps = {
  league: ILeague;
};

export default function LeagueDescription({ league }: LeagueDescriptionProps) {
  return (
    <Card maxW='container.xl'>
      <CardBody>
        <Heading>{league.name}</Heading>
        <Text>{league.description}</Text>
      </CardBody>
    </Card>
  );
}
