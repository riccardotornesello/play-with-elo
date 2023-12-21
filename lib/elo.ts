// TODO: handle more than 2 users
// TODO: variable configuration per league

export const config = {
  matchWeight: 50,
  pointsWeight: {
    0: 1,
    1: 1,
    2: 1.5,
    3: 1.75,
    4: 1.875,
    5: 2,
    6: 2.125,
    7: 2.25,
    8: 2.375,
    9: 2.5,
    10: 2.625,
  },
} as {
  matchWeight: number;
  pointsWeight: { [key: number]: number };
};

type EloPlayer = {
  playerId: string;
  points: number;
  rating: number;
};

export type CalculateElo = {
  players: EloPlayer[];
};

export function calculateElo({ players }: CalculateElo): Map<string, number> {
  const pointsDifference = Math.abs(players[0].points - players[1].points);
  const pointsDifferenceWeight = config.pointsWeight[pointsDifference] || config.pointsWeight[10];

  const expectedResults = players.map((player, index) => {
    let opponent;
    if (index === 0) {
      opponent = players[1];
    } else {
      opponent = players[0];
    }

    return 1 / (1 + 10 ** ((opponent.rating - player.rating) / 400));
  });

  const actualResults = players.map((player, index) => {
    if (player.points > players[index === 0 ? 1 : 0].points) {
      return 1;
    } else if (player.points < players[index === 0 ? 1 : 0].points) {
      return 0;
    } else {
      return 0.5;
    }
  });

  const newRatings = players.map((player, index) => {
    return Math.round(
      player.rating +
        config.matchWeight *
          pointsDifferenceWeight *
          (actualResults[index] - expectedResults[index])
    );
  });

  const ratingMap = new Map();
  newRatings.forEach((rating, index) => {
    ratingMap.set(players[index].playerId, rating);
  });

  return ratingMap;
}
