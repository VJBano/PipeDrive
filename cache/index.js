import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache");
const CACHE_FILE = path.join(CACHE_DIR, "pipedrive_deal_cache.json");

const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour

// const CACHE_EXPIRATION = 5 * 1000;

const Cache = {
  read: () => {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
    if (fs.existsSync(CACHE_FILE)) {
      const rawData = fs.readFileSync(CACHE_FILE);
      return JSON.parse(rawData);
    }
    return { timestamp: 0, deals: [] };
  },
  write: (newDeals) => {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
    let cache;

    try {
      cache = Cache.read();
    } catch (error) {
      console.error("Error reading cache, resetting cache:", error);
      cache = { timestamp: 0, deals: newDeals };
    }

    const now = Date.now();

    if (now - cache.timestamp >= CACHE_EXPIRATION) {
      console.log("Cache expired. Resetting with new deals.");
      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify({ timestamp: now, deals: newDeals }, null, 2)
      );
      return;
    }

    const existingDealIDs = new Set(cache.deals.map((deal) => deal.Deal_ID));
    const newEntries = newDeals.filter(
      (deal) => !existingDealIDs.has(deal.Deal_ID)
    );

    if (newEntries.length > 0) {
      console.log(`Appending ${newEntries.length} new deals to cache.`);
      const updatedDeals = [...cache.deals, ...newEntries];

      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify({ timestamp: now, deals: updatedDeals }, null, 2)
      );
    }
  },
};

export default Cache;
