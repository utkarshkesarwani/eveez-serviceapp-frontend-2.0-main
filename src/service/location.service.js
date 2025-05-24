import axiosInstance, { appApiInstance } from "./api";

async function getLocation() {
  try {
    const response = await axiosInstance.post("/getlocations", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getHubList(){
  try {
    const response = await appApiInstance.get("/master/getHubList");
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { getLocation, getHubList};
