import PipeDriveAPI from "../api/pipe_drive.js";
import Cache from "../cache/index.js";
import currencyFormatter from "../helpers/currency.js";

const getPipelineStages = async () => {
  try {
    const response = await PipeDriveAPI.getAllPipelineStages();
    const stages = response.data.data;
    return stages.reduce((map, stage) => {
      map[stage.id] = stage.name;
      return map;
    }, {});
  } catch (error) {
    throw new Error(`getPipelineStages: ${error}`);
  }
};

export const getActiveDeals = async () => {
  try {
    const cache = Cache.read();

    const activeDeals = await PipeDriveAPI.getActiveDeals();
    const pipelineStages = await getPipelineStages();

    const formattedDeals = activeDeals.data.data
      .filter((deal) => deal.status === "open")
      .map((deal) => ({
        Deal_ID: deal.id,
        Deal_Name: deal.title,
        Pipeline_Stage: pipelineStages[deal.stage_id],
        Owner: deal?.owner_name || "No owner",
        Organization_Name: deal.org_id?.name || "No Organization",
        Customer_Email: deal.person_id?.email?.[0]?.value || "No Email",
        Deal_Value: currencyFormatter(deal.currency, deal.value || 0),
        Created_Date: deal.add_time || "Unknown Date",
        Last_Updated_Date: deal.update_time || "Unknown Date",
      }));

    // If no new deals, return cache
    const existingDealIDs = new Set(cache.deals.map((deal) => deal.Deal_ID));
    const newDeals = formattedDeals.filter(
      (deal) => !existingDealIDs.has(deal.Deal_ID)
    );

    // Write only new deals to cache
    Cache.write(newDeals);
    return [...cache.deals, ...newDeals];
  } catch (error) {
    throw new Error(`getActiveDeals: ${error.message}`);
  }
};
