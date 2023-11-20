export async function POST(request: Request) {
  // Just expire the access token cookie

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
