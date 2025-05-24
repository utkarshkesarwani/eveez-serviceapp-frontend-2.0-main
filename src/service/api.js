import axios from "axios";

const BASE_URL = "https://eveez.in:3906";
// const BASE_URL = "http://localhost:3906";

// const APP_URL = "http://localhost:7001"
const APP_URL = "https://eveez.in:7001"


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

export const appApiInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default axiosInstance;


