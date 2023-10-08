// Next
import { NextApiRequest, NextApiResponse } from 'next';

async function signOutHandler(req: NextApiRequest, res: NextApiResponse) {
  // Set cookie
  res.setHeader(
    'Set-Cookie',
    'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  );

  return res.status(200).json({});
}

export default signOutHandler;
