import appendNewDealsToSheet from "../google/index.js";
import { google } from "googleapis";

jest.mock("googleapis", () => {
  const sheetsMock = {
    spreadsheets: {
      values: {
        get: jest.fn(),
        update: jest.fn(),
        append: jest.fn(),
      },
    },
  };
  return {
    google: {
      auth: {
        getClient: jest.fn().mockResolvedValue("mockAuth"),
      },
      sheets: jest.fn().mockReturnValue(sheetsMock),
    },
  };
});

describe("appendNewDealsToSheet", () => {
  let sheetsMock;

  beforeEach(() => {
    sheetsMock = google.sheets();
    jest.clearAllMocks();
  });

  it("should append new deals if they are not already present", async () => {
    sheetsMock.spreadsheets.values.get.mockResolvedValue({
      data: {
        values: [
          [
            "Deal_ID",
            "Deal_Name",
            "Pipeline_Stage",
            "Owner",
            "Organization_Name",
            "Customer_Email",
            "Deal_Value",
            "Created_Date",
            "Last_Updated_Date",
          ],
        ],
      },
    });

    const newDeals = [{ Deal_ID: "123", Deal_Name: "New Deal" }];

    await appendNewDealsToSheet(newDeals);

    expect(sheetsMock.spreadsheets.values.append).toHaveBeenCalledWith({
      spreadsheetId: process.env.SHEET_ID,
      range: "Deals!A1",
      valueInputOption: "RAW",
      resource: {
        values: [["123", "New Deal", "", "", "", "", "", "", ""]],
      },
    });
  });

  it("should not append deals if they already exist", async () => {
    sheetsMock.spreadsheets.values.get.mockResolvedValue({
      data: {
        values: [
          ["Deal_ID", "Deal_Name"],
          ["123", "Existing Deal"],
        ],
      },
    });

    const newDeals = [{ Deal_ID: "123", Deal_Name: "New Deal" }];

    await appendNewDealsToSheet(newDeals);

    expect(sheetsMock.spreadsheets.values.append).not.toHaveBeenCalled();
  });
});
