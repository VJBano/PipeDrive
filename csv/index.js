import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const CSV_FOLDER = path.join(process.cwd(), "csv");
const CSV_FILE = path.join(CSV_FOLDER, "pipedrive_deals.csv");

const CSV_HEADERS = [
  "Deal_ID",
  "Deal_Name",
  "Pipeline_Stage",
  "Owner",
  "Organization_Name",
  "Customer_Email",
  "Deal_Value",
  "Created_Date",
  "Last_Updated_Date",
];

// Function to check if a file exists
const isFileExist = (filePath) => fs.existsSync(filePath);

// Function to read existing CSV data
const readExistingCSV = () => {
  if (!isFileExist(CSV_FILE)) return [];
  const content = fs.readFileSync(CSV_FILE, "utf8");
  return parse(content, { columns: true });
};

const csvGenerator = (deals) => {
  if (!isFileExist(CSV_FOLDER)) {
    fs.mkdirSync(CSV_FOLDER, { recursive: true });
  }

  let existingDeals = readExistingCSV();
  const existingDealIds = new Set(
    existingDeals.map((deal) => String(deal.deal_id))
  );

  // Filter out only truly new deals
  const uniqueDeals = deals.filter(
    (deal) => !existingDealIds.has(String(deal.deal_id))
  );

  if (uniqueDeals.length === 0) {
    console.log("No new deals to add. CSV is up-to-date.");
    return;
  }

  // Convert unique deals to CSV format
  const csvData = stringify(uniqueDeals, { columns: CSV_HEADERS });

  if (!isFileExist(CSV_FILE)) {
    fs.writeFileSync(
      CSV_FILE,
      stringify([CSV_HEADERS], { header: false }) + csvData
    );
  } else {
    fs.appendFileSync(CSV_FILE, csvData);
  }

  console.log(`Added ${uniqueDeals.length} new deal(s) to ${CSV_FILE}`);
};

export default csvGenerator;
