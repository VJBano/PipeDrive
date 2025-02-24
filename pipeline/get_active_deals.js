import PipeDriveAPI from "../api/pipe_drive.js";

export const getActiveDeals = async () => {
  try {
    const activeDeals = await PipeDriveAPI.getActiveDeals();

    const formattedDeals = activeDeals.data.data
      .filter((deal) => deal.status === "open")
      .map((deal) => ({
        Deal_ID: deal.id,
        Deal_Name: deal.title,
        Pipeline_Stage: deal.stage_id || "Unknown Stage",
        Owner: deal.owner_id?.name || "No Owner",
        Organization_Name: deal.org_id?.name || "No Organization",
        Customer_Email: deal.person_id?.email?.[0]?.value || "No Email",
        Deal_Value: deal.value || 0,
        Created_Date: deal.add_time || "Unknown Date",
        Last_Updated_Date: deal.update_time || "Unknown Date",
      }));

    return formattedDeals;
  } catch (error) {
    throw new Error(`getActiveDeals: ${error}`);
  }
};

export default getActiveDeals;
