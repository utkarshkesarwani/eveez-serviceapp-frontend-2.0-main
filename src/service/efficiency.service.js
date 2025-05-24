import axiosInstance from "./api";

async function GetAvgTaskCompletionData(userLocation) {
  try {
    const response = await axiosInstance.post("/technicianAverageTime", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      location: userLocation,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetTechnicianPerformceData(Location) {
  try {
    const response = await axiosInstance.post("/technicianPerformance", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      location: Location,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetWeeklyAnalysisData(
  startTime,
  endTime,
  Location,
  RequestType
) {
  try {
    const response = await axiosInstance.post("/weeklyAnalysis", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      location: Location,
      start_date: startTime,
      end_date: endTime,
      requestType: RequestType || "",
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export {
  GetAvgTaskCompletionData,
  GetTechnicianPerformceData,
  GetWeeklyAnalysisData,
};
