import PipedriveInstance from "./config.js";

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
      throw new Error(`get Pipeline Stages: ${error.message}`);
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
      throw new Error(`get Active Deals: ${error.message}`);
    }
  },
};

export default PipeDriveAPI;
