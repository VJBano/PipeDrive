import PipedriveInstance from "../api/config.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("Pipedrive API Authentication", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test("should successfully authenticate and connect to the API", async () => {
    mock.onGet(`${process.env.PIPEDRIVE_API}/users/me`).reply(200, {
      success: true,
      data: { id: 123, name: "Token" },
    });

    // Make the actual request
    const response = await PipedriveInstance.get("/users/me");

    console.log("Actual API Response:", response.data);

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.name).toBe("Token");
  });

  test("should return an authentication error with invalid API key", async () => {
    mock.onGet(`${process.env.PIPEDRIVE_API}/users/me`).reply(401, {
      success: false,
      error: "Invalid API token",
    });

    try {
      await PipedriveInstance.get("/users/me");
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.error).toBe("Invalid API token");
    }
  });
});
