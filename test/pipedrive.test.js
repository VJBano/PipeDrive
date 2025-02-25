import PipeDriveAPI from "../api/pipe_drive.js";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("PipeDriveAPI Tests", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test("should fetch all pipeline stages successfully", async () => {
    const mockResponse = {
      success: true,
      data: [
        { id: 1, name: "Qualified", pipeline_id: 1 },
        { id: 2, name: "Contact Made", pipeline_id: 1 },
        { id: 3, name: "Demo Scheduled", pipeline_id: 1 },
        { id: 4, name: "Proposal Made", pipeline_id: 1 },
        { id: 5, name: "Negotiations Started", pipeline_id: 1 },
      ],
    };

    mock.onGet("/stages").reply(200, mockResponse);

    const response = await PipeDriveAPI.getAllPipelineStages();

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data).toHaveLength(5);
    expect(response.data.data.some((stage) => stage.name === "Qualified")).toBe(
      true
    );
  });

  test("should fetch active deals successfully", async () => {
    mock.onGet("/deals?status=open").reply(200, {
      success: true,
      data: [
        { id: 101, title: "Random Deal 1", status: "open" },
        { id: 102, title: "Random Deal 2", status: "open" },
      ],
    });

    const response = await PipeDriveAPI.getActiveDeals();

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.length).toBeGreaterThanOrEqual(1);
    expect(
      response.data.data.every((deal) => typeof deal.id === "number")
    ).toBe(true);
    expect(
      response.data.data.every((deal) => typeof deal.title === "string")
    ).toBe(true);
  });
});
