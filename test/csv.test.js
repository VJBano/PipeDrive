import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import csvGenerator from "../csv/index.js";
import { stringify } from "csv-stringify/sync";

const CSV_FOLDER = path.join(process.cwd(), "csv");
const CSV_FILE = path.join(CSV_FOLDER, "pipedrive_deals.csv");

// Mock deals data
const mockDeals = [
  {
    Deal_ID: "1",
    Deal_Name: "Test Deal 1",
    Pipeline_Stage: "Prospecting",
    Owner: "John Doe",
    Organization_Name: "Test Corp",
    Customer_Email: "test1@example.com",
    Deal_Value: "1000",
    Created_Date: "2024-01-01",
    Last_Updated_Date: "2024-01-10",
  },
  {
    Deal_ID: "2",
    Deal_Name: "Test Deal 2",
    Pipeline_Stage: "Negotiation",
    Owner: "Jane Smith",
    Organization_Name: "Example Inc",
    Customer_Email: "test2@example.com",
    Deal_Value: "2000",
    Created_Date: "2024-02-01",
    Last_Updated_Date: "2024-02-10",
  },
];

jest.mock("fs");

describe("CSV Generator", () => {
  let mockFileSystem = {};

  beforeEach(() => {
    mockFileSystem = {}; // Reset before each test

    fs.existsSync.mockImplementation((filePath) => !!mockFileSystem[filePath]);

    fs.readFileSync.mockImplementation((filePath) => {
      if (!mockFileSystem[filePath]) throw new Error("File not found");
      return mockFileSystem[filePath];
    });

    fs.writeFileSync.mockImplementation((filePath, data) => {
      mockFileSystem[filePath] = data;
    });

    fs.appendFileSync.mockImplementation((filePath, data) => {
      if (!mockFileSystem[filePath]) {
        mockFileSystem[filePath] = "";
      }
      mockFileSystem[filePath] += data; // ✅ Ensures new data is appended
    });

    fs.mkdirSync.mockImplementation((folderPath) => {
      mockFileSystem[folderPath] = true;
    });
  });

  test("should create a new CSV file if it does not exist", () => {
    csvGenerator(mockDeals);

    expect(fs.existsSync(CSV_FILE)).toBe(true);

    const content = fs.readFileSync(CSV_FILE, "utf8");
    const parsedData = parse(content, { columns: true });

    expect(parsedData.length).toBe(2);
    expect(parsedData[0].Deal_Name).toBe("Test Deal 1");
  });

  test("should append only new deals to the CSV file", () => {
    const existingDeals = [
      {
        Deal_ID: "1",
        Deal_Name: "Test Deal 1",
        Pipeline_Stage: "Prospecting",
        Owner: "John Doe",
        Organization_Name: "Test Corp",
        Customer_Email: "test1@example.com",
        Deal_Value: "1000",
        Created_Date: "2024-01-01",
        Last_Updated_Date: "2024-01-10",
      },
      {
        Deal_ID: "2",
        Deal_Name: "Test Deal 2",
        Pipeline_Stage: "Negotiation",
        Owner: "Jane Smith",
        Organization_Name: "Example Inc",
        Customer_Email: "test2@example.com",
        Deal_Value: "2000",
        Created_Date: "2024-02-01",
        Last_Updated_Date: "2024-02-10",
      },
    ];

    const csvHeader = [
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

    // ✅ Correctly simulate existing CSV file
    mockFileSystem[CSV_FILE] =
      stringify([csvHeader], { header: false }) +
      stringify(existingDeals, { header: false });

    const newDeals = [
      {
        Deal_ID: "3", // ✅ This is new and should be appended
        Deal_Name: "Test Deal 3",
        Pipeline_Stage: "Won",
        Owner: "Alice Johnson",
        Organization_Name: "Acme Ltd",
        Customer_Email: "test3@example.com",
        Deal_Value: "3000",
        Created_Date: "2024-03-01",
        Last_Updated_Date: "2024-03-10",
      },
    ];

    csvGenerator(newDeals); // Run function

    // ✅ Read updated CSV content
    const content = mockFileSystem[CSV_FILE].trim(); // 🔥 Fix: Ensure no unexpected line breaks
    const parsedData = parse(content, {
      columns: true,
      skip_empty_lines: true,
    }); // 🔥 Fix: Ignore empty lines

    // ✅ Extract Deal_IDs to verify correct addition
    const dealIds = parsedData.map((deal) => deal.Deal_ID);

    // ✅ Expect 3 rows (1 new deal added)
    expect(parsedData.length).toBe(3);
    expect(dealIds).toEqual(["1", "2", "3"]); // ✅ Only Deal_ID "3" should be new
  });

  test("should log when no new deals are added", () => {
    console.log = jest.fn(); // Mock console.log

    csvGenerator(mockDeals);
    csvGenerator(mockDeals); // Second run with the same data

    expect(console.log).toHaveBeenCalledWith(
      "No new deals to add. CSV is up-to-date."
    );
  });
  test("should not append duplicate deals", () => {
    csvGenerator(mockDeals); // First run
    csvGenerator(mockDeals); // Second run with the same data

    const content = fs.readFileSync(CSV_FILE, "utf8");
    const parsedData = parse(content, { columns: true });

    expect(parsedData.length).toBe(2); // No duplicates should be added
  });

  test("should handle an already up-to-date CSV file", () => {
    console.log = jest.fn(); // Mock console.log to verify messages

    csvGenerator(mockDeals);
    csvGenerator(mockDeals); // Second run with same data

    expect(console.log).toHaveBeenCalledWith(
      "No new deals to add. CSV is up-to-date."
    );
  });
});
