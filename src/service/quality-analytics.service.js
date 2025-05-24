import axiosInstance from "./api";

async function GetRequestTypeStats(timeSpan, userLocation) {
  try {
    const response = await axiosInstance.post(
      `getRequestTypesCount/${timeSpan}`,
      {
        key: import.meta.env.VITE_SERVER_KEY,
        token: localStorage.getItem("token"),
        location: userLocation,
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetIssueTypeStats(timeSpan, technician = "", userLocation) {
  try {
    const response = await axiosInstance.post(`/getIssueTypeStats`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      location: userLocation,
      technician,
      timeSpan,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetCustomerRatingData() {
  try {
    //Not implemented Yet
    return "";
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export { GetRequestTypeStats, GetIssueTypeStats, GetCustomerRatingData };




