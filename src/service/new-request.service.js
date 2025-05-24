import axiosInstance from "./api";

async function GetDetailsByVehicleId(vehicleNo) {
  try {
    const response = await axiosInstance.post(`getdetailsbyvehicleid`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        vehicle_no: vehicleNo,
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
    const response = await axiosInstance.post(`getallrequesttypes`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetAllIssueTypes() {
  try {
    const response = await axiosInstance.post(`getallissuetype`, {
      key: import.meta.env.VITE_SERVER_KEY,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function CreateNewRequest(payload) {
  try {
    const response = await axiosInstance.post(`addrequest`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: payload,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function UpdateTechnician(TicketId, newTechnician) {
  try {
    const response = await axiosInstance.post(`updatetechnician`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        ticket_id: TicketId,
        assigned_technician: newTechnician,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export {
  GetDetailsByVehicleId,
  GetAllRequestTypes,
  GetAllIssueTypes,
  CreateNewRequest,
  UpdateTechnician,
};
