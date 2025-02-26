import fs from "fs";
import Cache from "../cache/index.js";
import path from "path";
jest.mock("fs");

const CACHE_FILE = path.join(
  process.cwd(),
  "cache",
  "pipedrive_deal_cache.json"
);

describe("Cache Module", () => {
  let mockFileSystem = {};

  beforeEach(() => {
    fs.existsSync.mockImplementation((filePath) => !!mockFileSystem[filePath]);

    fs.readFileSync.mockImplementation((filePath) => {
      if (!mockFileSystem[filePath]) throw new Error("File not found");
      return mockFileSystem[filePath];
    });

    fs.writeFileSync.mockImplementation((filePath, data) => {
      mockFileSystem[filePath] = data;
    });

    fs.mkdirSync.mockImplementation((folderPath) => {
      mockFileSystem[folderPath] = true;
    });
  });

  test("should read empty cache when no cache file exists", () => {
    expect(Cache.read()).toEqual({ timestamp: 0, deals: [] });
  });

  test("should write and read cache correctly", () => {
    const testDeals = [{ Deal_ID: 1, Deal_Name: "Test Deal" }];
    Cache.write(testDeals);

    const cachedData = JSON.parse(mockFileSystem[CACHE_FILE]);
    expect(cachedData.deals).toEqual(testDeals);
  });

  test("should append new deals and avoid duplicates", () => {
    const initialDeals = [{ Deal_ID: 1, Deal_Name: "Initial Deal" }];
    Cache.write(initialDeals);

    const newDeals = [
      { Deal_ID: 1, Deal_Name: "Initial Deal" },
      { Deal_ID: 2, Deal_Name: "New Deal" },
    ];
    Cache.write(newDeals);

    const cachedData = JSON.parse(mockFileSystem[CACHE_FILE]);

    expect(cachedData.deals).toHaveLength(2);

    expect(cachedData.deals.some((deal) => deal.Deal_ID === 1)).toBe(true);
    expect(cachedData.deals.some((deal) => deal.Deal_ID === 2)).toBe(true);
  });

  test("should reset cache if expired", () => {
    const oldTimestamp = Date.now() - 100000000;

    mockFileSystem[CACHE_FILE] = JSON.stringify({
      timestamp: oldTimestamp,
      deals: [{ Deal_ID: 1, Deal_Name: "Old Deal" }],
    });

    const newDeals = [{ Deal_ID: 2, Deal_Name: "New Deal" }];
    Cache.write(newDeals);

    const cachedData = JSON.parse(mockFileSystem[CACHE_FILE]);

    expect(cachedData.deals).toHaveLength(1);

    expect(cachedData.deals).toContainEqual({
      Deal_ID: 2,
      Deal_Name: "New Deal",
    });
  });
});
