import { Card, CardHeader, CardBody, Text, Heading } from '@chakra-ui/react';

export type LeagueDescriptionProps = {
  // TODO: Add league type
  league: any;
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
