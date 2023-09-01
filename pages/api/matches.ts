import { getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prisma';
import { calculateElo } from '../../lib/elo';
import { sendTelegramNotification } from '../../lib/telegram';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // TODO: add input validation

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      homePlayerId,
      awayPlayerId,
      homeScore,
      awayScore,
      homeTeam,
      awayTeam,
      playedAt,
    } = req.body;

    const oldTopPlayers = await prisma.player.findMany({
      take: 5,
      orderBy: {
        elo: 'desc',
      },
    });

    const homePlayer = await prisma.player.findUnique({
      where: { id: homePlayerId },
    });
    const awayPlayer = await prisma.player.findUnique({
      where: { id: awayPlayerId },
    });

    if (!homePlayer || !awayPlayer) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const [homeNewRating, awayNewRating] = calculateElo(
      homePlayer.elo,
      awayPlayer.elo,
      homeScore,
      awayScore,
    );

    const match = await prisma.match.create({
      data: {
        homePlayer: {
          connect: {
            id: homePlayerId,
          },
        },
        awayPlayer: {
          connect: {
            id: awayPlayerId,
          },
        },
        homeScore,
        awayScore,
        homeTeam,
        awayTeam,
        homePointsDifference: homeNewRating - homePlayer.elo,
        awayPointsDifference: awayNewRating - awayPlayer.elo,
        playedAt,
      },
    });

    await prisma.player.update({
      where: { id: homePlayerId },
      data: { elo: homeNewRating },
    });
    await prisma.player.update({
      where: { id: awayPlayerId },
      data: { elo: awayNewRating },
    });

    const newTopPlayers = await prisma.player.findMany({
      take: 5,
      orderBy: {
        elo: 'desc',
      },
    });

    const ranking = newTopPlayers.map((player, index) => ({
      username: player.username,
      points: player.elo,
      positionDiff: index - oldTopPlayers.findIndex((p) => p.id === player.id),
    }));

    await sendTelegramNotification({
      homePlayer: {
        username: homePlayer.username,
        score: homeScore,
        points: homeNewRating,
        diff: homeNewRating - homePlayer.elo,
      },
      awayPlayer: {
        username: awayPlayer.username,
        score: awayScore,
        points: awayNewRating,
        diff: awayNewRating - awayPlayer.elo,
      },
      ranking,
    });

    res.status(200).json(match);
  } else if (req.method === 'GET') {
    const matches = await prisma.match.findMany({
      take: 10,
      orderBy: {
        playedAt: 'desc',
      },
      include: {
        homePlayer: true,
        awayPlayer: true,
      },
    });

    res.status(200).json(matches);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
