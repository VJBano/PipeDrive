import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const SCOPES = process.env.SCOPES;
const SHEET_ID = process.env.SHEET_ID;
const SERVICE_ACCOUNT_KEY_PATH = process.env.SERVICE_ACCOUNT_KEY_PATH;
const HEADERS = [
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

const authenticateGoogleSheets = () => {
  return google.auth.getClient({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: SCOPES,
  });
};

const getSheetData = async (sheets, range) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });
  return response.data.values || [];
};

const appendNewDealsToSheet = async (newDeals) => {
  const auth = await authenticateGoogleSheets();
  const sheets = google.sheets({ version: "v4", auth });

  const sheetData = await getSheetData(sheets, "Deals");

  if (!sheetData.length || sheetData[0].join(",") !== HEADERS.join(",")) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: "Deals!A1",
      valueInputOption: "RAW",
      resource: { values: [HEADERS] },
    });
    console.log("Headers added to the sheet.");
  }

  // Get existing Deal_IDs to avoid duplicates
  const existingDealIDs = new Set(sheetData.slice(1).map((row) => row[0]));

  // Filter new deals that are not already in the sheet
  const newEntries = newDeals
    .filter((deal) => !existingDealIDs.has(deal.Deal_ID.toString()))
    .map((deal) => HEADERS.map((key) => deal[key] || ""));

  if (newEntries.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Deals!A1",
      valueInputOption: "RAW",
      resource: { values: newEntries },
    });
    console.log(`${newEntries.length} new deals appended.`);
  } else {
    console.log("No new deals to append.");
  }
};

export default appendNewDealsToSheet;
