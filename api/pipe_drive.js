import dotenv from "dotenv";
import AxiosInstance from "./config.js";

dotenv.config();

const API_KEY = process.env.PIPEDRIVE_API_KEY;

const PipeDriveAPI = {
  getActiveDeals: async () => {
    try {
      const data = AxiosInstance.get(
        `/deals?status=open&api_token=${API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      error;
    }

    throw new error(`get Active Deals: ${error} `);
  },
};

export default PipeDriveAPI;
