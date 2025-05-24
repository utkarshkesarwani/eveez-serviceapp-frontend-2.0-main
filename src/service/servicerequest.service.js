import axiosInstance from "./api";

async function GetServiceRequestStats(userLocation) {
  try {
    const response = await axiosInstance.post("/getrequeststats", {
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

async function GetAllServiceRequests(userLocation) {
  try {
    const response = await axiosInstance.post("/allservicerequest", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        technician: "",
        location: userLocation,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetAllRequestTypes() {
  try {
    const response = await axiosInstance.post("/getallrequesttypes", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function GetNotAssignedRequests(Location) {
  try {
    const response = await axiosInstance.post("/getNotAssignedRequests", {
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
async function GetInProgressTickets(Location) {
  try {
    const response = await axiosInstance.post("/getStillInProgressRequests", {
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
async function GetNotDoneRequests(Location) {
  try {
    const response = await axiosInstance.post("/getNotDoneRequests", {
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

async function GetServiceRequestSummary(Payload) {
  try {
    const response = await axiosInstance.post("/getServiceRequestStats", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: Payload,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetDownlodableServiceData(payload) {
  try {
    const response = await axiosInstance.post("/getServiceDataBasedOnQuery", {
      key: import.meta.env.VITE_SERVER_KEY,
      data: payload,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export {
  GetServiceRequestStats,
  GetAllServiceRequests,
  GetAllRequestTypes,
  GetNotAssignedRequests,
  GetInProgressTickets,
  GetNotDoneRequests,
  GetServiceRequestSummary,
  GetDownlodableServiceData,
};






