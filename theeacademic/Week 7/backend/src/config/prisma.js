const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' }
  ]
});

prisma.$on('error', (e) => logger.error({ prisma: e }, 'Prisma error'));
prisma.$on('warn', (e) => logger.warn({ prisma: e }, 'Prisma warn'));
prisma.$on('info', (e) => logger.info({ prisma: e }, 'Prisma info'));

module.exports = prisma;
