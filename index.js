import PipeDriveAPI from "./api/pipe_drive.js";

PipeDriveAPI.getActiveDeals().then((res) => {
  const activeDeals = res.data.data
    .filter((deal) => deal.status === "open") // Ensure it's open
    .map((deal) => ({
      id: deal.id,
      title: deal.title,
      value: deal.value,
      currency: deal.currency,
      status: deal.status,
      person: deal.person_id?.name || "No Contact",
      organization: deal.org_id?.name || "No Organization",
    }));

  console.log("Active Deals: ", activeDeals);
});
