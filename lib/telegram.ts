import config from '../lib/config';

interface MatchPlayer {
  username: string;
  score: number;
  points: number;
  diff: number;
}

interface RankingPlayer {
  username: string;
  points: number;
  positionDiff: number;
}

interface TelegramNotificationInput {
  homePlayer: MatchPlayer;
  awayPlayer: MatchPlayer;

  ranking: RankingPlayer[];
}

function pointsString(points: number) {
  if (points >= 0) {
    return `+${Math.round(points)} 📈`;
  } else {
    return `${Math.round(points)} 📉`;
  }
}

function matchResultString(homePlayer: MatchPlayer, awayPlayer: MatchPlayer) {
  return `${homePlayer.username} ${homePlayer.score}:${awayPlayer.score} ${awayPlayer.username}`;
}

function matchPlayerString(player: MatchPlayer) {
  return `${player.username}: ${Math.round(
    player.points,
  )} points (${pointsString(player.diff)})`;
}

function rankingPlayerString(position: number, player: RankingPlayer) {
  const positionString =
    position === 1
      ? '🥇'
      : position === 2
      ? '🥈'
      : position === 3
      ? '🥉'
      : ` ${position}.`;

  const increaseString =
    player.positionDiff > 0 ? '↗️' : player.positionDiff < 0 ? '↘️' : '➡️';

  return `${increaseString}${positionString} ${player.username}: ${Math.round(
    player.points,
  )} points`;
}

function rankingMessageString(ranking: RankingPlayer[]) {
  const changedPositions = ranking.filter(
    (player) => player.positionDiff !== 0,
  );
  if (changedPositions.length === 0) {
    return '';
  } else {
    return '\n🎉 There are some changes in the top positions ranking!\n';
  }
}

export async function sendTelegramNotification({
  homePlayer,
  awayPlayer,
  ranking,
}: TelegramNotificationInput) {
  const text = `
A match has just ended!

🏆 ${matchResultString(homePlayer, awayPlayer)} 🏆
${matchPlayerString(homePlayer)}
${matchPlayerString(awayPlayer)}

${rankingMessageString(ranking)}
📈 Updated ranking:
${ranking
  .map((player, index) => rankingPlayerString(index + 1, player))
  .join('\n')}


Visit ${config.platform.url} to see the full ranking!
`;

  const res = await fetch(
    `https://api.telegram.org/bot${config.telegram.token}/sendMessage`,
    {
      method: 'POST',
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        text: text,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    throw new Error('Something went wrong');
  }

  return res.json();
}
