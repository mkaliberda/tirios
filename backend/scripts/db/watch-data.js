const fs = require('fs');
const path = require('path');
const prisma = require('../../src/lib/prisma');
const cache = require('../../src/lib/cache');
const { invalidateItemsAndStatsCache, warmStatsAndAllItemsCache } = require('../../src/lib/items-cache');
const { syncItemsFromFile, ITEMS_PATH } = require('./seed');

const WATCH_DEBOUNCE_MS = 400;
const WATCH_FILE_INTERVAL_MS = 1000;

const watchedDirectory = path.dirname(ITEMS_PATH);

let pendingTimeout;
let isSyncRunning = false;
let needsResync = false;
let directoryWatcher;

async function runSync(trigger) {
  if (isSyncRunning) {
    needsResync = true;
    return;
  }

  isSyncRunning = true;

  try {
    do {
      needsResync = false;
      await syncItemsFromFile();
      await invalidateItemsAndStatsCache();
      await warmStatsAndAllItemsCache();
      console.log(`[db-watch] synced data (${trigger})`);
    } while (needsResync);
  } catch (error) {
    console.error('[db-watch] sync failed', error);
  } finally {
    isSyncRunning = false;
  }
}

function queueSync(trigger) {
  clearTimeout(pendingTimeout);
  pendingTimeout = setTimeout(() => {
    runSync(trigger);
  }, WATCH_DEBOUNCE_MS);
}

function handleWatchEvent(eventType, changedName) {
  const suffix = changedName ? ` (${changedName})` : '';
  queueSync(`${eventType} event${suffix}`);
}

async function shutdown(signal) {
  clearTimeout(pendingTimeout);
  if (directoryWatcher) {
    directoryWatcher.close();
  }
  fs.unwatchFile(ITEMS_PATH);
  await Promise.allSettled([prisma.$disconnect(), cache.disconnect()]);
  console.log(`[db-watch] stopped on ${signal}`);
  process.exit(0);
}

async function main() {
  await runSync('startup');

  directoryWatcher = fs.watch(watchedDirectory, handleWatchEvent);
  fs.watchFile(ITEMS_PATH, { interval: WATCH_FILE_INTERVAL_MS }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs || curr.size !== prev.size) {
      queueSync('watchFile change');
    }
  });

  console.log(`[db-watch] watching ${ITEMS_PATH}`);

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(async (error) => {
  console.error('[db-watch] failed to start', error);
  await Promise.allSettled([prisma.$disconnect(), cache.disconnect()]);
  process.exit(1);
});
