// Next
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(request: Request) {
  // Set cookie
  return Response.json(
    {},
    {
      status: 200,
      headers: {
        'Set-Cookie':
          'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      },
    },
  );
}
