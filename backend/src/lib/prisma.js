const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const prisma = connectionString
  ? new PrismaClient({
      adapter: new PrismaPg(new Pool({ connectionString }))
    })
  : new PrismaClient();

module.exports = prisma;
