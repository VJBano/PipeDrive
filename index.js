import csvGenerator from "./csv/index.js";
import jsonGenerator from "./json/index.js";
import { getActiveDeals } from "./pipeline/get_active_deals.js";
import appendNewDealsToSheet from "./google/index.js";
const Main = async () => {
  const pipeLineData = await getActiveDeals();
  csvGenerator(pipeLineData);
  jsonGenerator(pipeLineData);
  appendNewDealsToSheet(pipeLineData);
};

Main();
