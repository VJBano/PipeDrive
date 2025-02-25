import fs from "fs";
import path from "path";
import jsonGenerator from "../json/index.js";

jest.mock("fs");

const JSON_FOLDER = path.join(process.cwd(), "json");
const JSON_FILE = path.join(JSON_FOLDER, "pipedrive_deals.json");

describe("JSON Generator", () => {
  let mockFileSystem = {};

  beforeEach(() => {
    mockFileSystem = {};

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

  test("should create a new JSON file if it does not exist", () => {
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
    ];

    jsonGenerator(mockDeals);

    expect(fs.existsSync(JSON_FILE)).toBe(true);

    const content = JSON.parse(mockFileSystem[JSON_FILE]);
    expect(content.length).toBe(1);
    expect(content[0].Deal_Name).toBe("Test Deal 1");
  });

  test("should append new deals and avoid duplicates", () => {
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
    ];

    mockFileSystem[JSON_FILE] = JSON.stringify(existingDeals);

    const newDeals = [
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

    jsonGenerator(newDeals);

    const content = JSON.parse(mockFileSystem[JSON_FILE]);

    expect(content.length).toBe(2);
    expect(content.some((deal) => deal.Deal_ID === "2")).toBe(true);
  });

  test("should not append duplicate deals", () => {
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
    ];

    mockFileSystem[JSON_FILE] = JSON.stringify(mockDeals);

    jsonGenerator(mockDeals);

    const content = JSON.parse(mockFileSystem[JSON_FILE]);

    expect(content.length).toBe(1);
  });

  test("should handle an already up-to-date JSON file", () => {
    console.log = jest.fn();

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
    ];

    mockFileSystem[JSON_FILE] = JSON.stringify(mockDeals);

    jsonGenerator(mockDeals);

    expect(console.log).toHaveBeenCalledWith(
      "No new deals to add. JSON is up-to-date."
    );
  });
});
