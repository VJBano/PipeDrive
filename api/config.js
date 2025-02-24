import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.PIPEDRIVE_API_KEY;
const API = process.env.PIPEDRIVE_API;

const PipedriveInstance = axios.create({
  baseURL: API,
  withCredentials: "true",
  params: {
    api_token: API_KEY,
  },
});

export default PipedriveInstance;
