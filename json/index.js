import fs from "fs";
import path from "path";

const JSON_FOLDER = path.join(process.cwd(), "json");
const JSON_FILE = path.join(JSON_FOLDER, "pipedrive_deals.json");

// Function to check if a file exists
const isFileExist = (filePath) => fs.existsSync(filePath);

const readJsonFile = (filePath) => {
  if (!isFileExist(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
};

const jsonWriter = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
};

const jsonGenerator = (deals) => {
  if (!Array.isArray(deals)) {
    console.error("Input data must be an array.");
    return;
  }

  if (!isFileExist(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER, { recursive: true });
  }

  const existingData = readJsonFile(JSON_FILE);

  // 🔥 Fix: Match CSV behavior (using "Deal_ID" instead of "id")
  const existingDealIds = new Set(
    existingData.map((deal) => String(deal.Deal_ID))
  );

  // ✅ Filter only new deals
  const newDeals = deals.filter(
    (deal) => !existingDealIds.has(String(deal.Deal_ID))
  );

  if (newDeals.length === 0) {
    console.log("No new deals to add. JSON is up-to-date.");
    return;
  }

  const updatedData = [...existingData, ...newDeals];
  jsonWriter(JSON_FILE, updatedData);
  console.log(`Added ${newDeals.length} new deal(s) to ${JSON_FILE}`);
};

export default jsonGenerator;
