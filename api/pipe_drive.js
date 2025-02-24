import dotenv from "dotenv";
import PipedriveInstance from "./config.js";

dotenv.config();

const PipeDriveAPI = {
  getAllPipelineStages: async () => {
    try {
      const data = PipedriveInstance.get(`/stages`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      throw new error(`get Pipeline Stages: ${error} `);
    }
  },
  getActiveDeals: async () => {
    try {
      const data = PipedriveInstance.get(`/deals?status=open`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data;
    } catch (error) {
      throw new error(`get Active Deals: ${error} `);
    }
  },
};

export default PipeDriveAPI;
