module.exports = {
  port: 8080,
  directory: '.',
  open: true,
  liveReload: true,
  cors: true,
  headers: [
    {
      source: '**/*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache'
        }
      ]
    }
  ],
  rewrite: [
    {
      from: '/api/*',
      to: '/data/$1.json'
    }
  ]
};

