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

const jsonGenerator = (rawData) => {
  if (!Array.isArray(rawData)) {
    console.error("Input data must be an array.");
    return;
  }

  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER, { recursive: true });
  }

  const existingData = readJsonFile(JSON_FILE);

  const existingIds = new Set(existingData.map((item) => item.id));
  const filteredData = rawData.filter((item) => !existingIds.has(item.id));

  if (filteredData.length === 0) {
    console.log("No new unique data to add.");
    return;
  }

  const updatedData = [...existingData, ...filteredData];
  jsonWriter(JSON_FILE, updatedData);
  console.log(`Added ${filteredData.length} new deal(s) to ${JSON_FILE}`);
};

export default jsonGenerator;
