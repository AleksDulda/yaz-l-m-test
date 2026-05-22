import http from 'node:http';

const PORT = Number(process.env.MOCK_REQRES_PORT ?? 3099);

const FIXTURE_USER = {
  data: {
    id: 2,
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver',
    avatar: 'https://reqres.in/img/faces/2-image.jpg',
  },
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/api/users') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        name: body.name,
        job: body.job,
        id: String(Math.floor(Math.random() * 1000)),
        createdAt: new Date().toISOString(),
      }),
    );
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/users/2') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(FIXTURE_USER));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Mock Reqres server listening on http://localhost:${PORT}`);
});
