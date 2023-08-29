export const config = {
  matchWeight: 50,
  goalWeight: {
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
  goalWeight: { [key: number]: number };
};

export function calculateElo(
  homeRating: number,
  awayRating: number,
  homeScore: number,
  awayScore: number,
) {
  const goalDifference = Math.abs(homeScore - awayScore);
  const goalDifferenceWeight =
    config.goalWeight[goalDifference] || config.goalWeight[10];

  const homeExpectedResult = 1 / (1 + 10 ** ((awayRating - homeRating) / 400));
  const awayExpectedResult = 1 / (1 + 10 ** ((homeRating - awayRating) / 400));

  const homeActualResult =
    homeScore > awayScore ? 1 : homeScore === awayScore ? 0.5 : 0;
  const awayActualResult = 1 - homeActualResult;

  const homeNewRating =
    homeRating +
    config.matchWeight *
      goalDifferenceWeight *
      (homeActualResult - homeExpectedResult);
  const awayNewRating =
    awayRating +
    config.matchWeight *
      goalDifferenceWeight *
      (awayActualResult - awayExpectedResult);

  return [homeNewRating, awayNewRating];
}
