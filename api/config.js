import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API = process.env.PIPEDRIVE_API;
const AxiosInstance = axios.create({
  baseURL: API,
  withCredentials: "true",
});

export default AxiosInstance;
