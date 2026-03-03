const fs = require('fs/promises');
const path = require('path');
const prisma = require('../../src/lib/prisma');

const ITEMS_PATH = path.join(__dirname, '../../../data/items.json');

async function syncItemsFromFile() {
  const raw = await fs.readFile(ITEMS_PATH, 'utf8');
  const items = JSON.parse(raw);
  const normalizedItems = items.map((item) => ({
    id: Number.parseInt(item.id, 10),
    name: item.name,
    category: item.category,
    price: item.price
  }));

  const hasInvalidId = normalizedItems.some((item) => Number.isNaN(item.id));
  if (hasInvalidId) {
    throw new Error('Invalid item id in data file');
  }

  await prisma.$transaction(async (tx) => {
    await tx.item.deleteMany({});

    if (normalizedItems.length > 0) {
      await tx.item.createMany({
        data: normalizedItems
      });
    }

    await tx.$executeRawUnsafe(
      'SELECT setval(pg_get_serial_sequence(\'"Item"\', \'id\'), COALESCE((SELECT MAX(id) FROM "Item"), 1), true);'
    );
  });
}

module.exports = {
  syncItemsFromFile,
  ITEMS_PATH
};

if (require.main === module) {
  syncItemsFromFile()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
