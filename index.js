import csvGenerator from "./csv/index.js";
import jsonGenerator from "./json/index.js";
import { getActiveDeals } from "./pipeline/get_active_deals.js";

const Main = async () => {
  const pipeLineData = await getActiveDeals();
  csvGenerator(pipeLineData);
  jsonGenerator(pipeLineData);
};

Main();
