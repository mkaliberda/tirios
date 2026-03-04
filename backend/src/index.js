const app = require('./app');
const prisma = require('./lib/prisma');
const cache = require('./lib/cache');
require('dotenv').config();

const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log('Backend running on http://localhost:' + port));

async function closePrisma() {
  await Promise.allSettled([prisma.$disconnect(), cache.disconnect()]);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', closePrisma);
process.on('SIGTERM', closePrisma);
