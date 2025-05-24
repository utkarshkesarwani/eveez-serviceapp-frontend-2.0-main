import axiosInstance from "./api";
async function GetTechnicianRecords(userLocation) {
  try {
    const response = await axiosInstance.post("/getservicerecords", {
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

async function GetTechnicianStats({ location }) {
  try {
    const response = await axiosInstance.post("/gettechniciansrecords", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      location: location,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetOnTimevsDelayedData(userLocation) {
  try {
    const response = await axiosInstance.post("/delayedAndOnTimeTasks", {
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

async function GetTechnicianHistory(TechnicianName, userLocation) {
  try {
    const response = await axiosInstance.post("/gettechnicianhistory", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        technician: TechnicianName,
        location: userLocation,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export {
  GetTechnicianRecords,
  GetTechnicianStats,
  GetOnTimevsDelayedData,
  GetTechnicianHistory,
};




