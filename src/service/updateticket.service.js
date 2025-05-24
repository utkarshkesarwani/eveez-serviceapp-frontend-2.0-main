import axiosInstance, { appApiInstance } from "./api";

async function UpdateTechnicianForTicket(TicketId, NewTechncian) {
  try {
    const response = await axiosInstance.post(`updatetechnician`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        // assigned_technician: NewTechncian.name,
        ticket_id: TicketId,
        technician_id: NewTechncian,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function UpdateCompleteTicketData(Payload) {
  try {
    const response = await axiosInstance.post(`updaterequest`, {
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

async function GetPartsForVehicle(vehicleNumber) {
  try {
    const response = await axiosInstance.post(`getparts`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        vehicle_no: vehicleNumber,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function RequestPartsForTicket(TicketId, RequestedParts, imageUrls) {
  try {
    const response = await axiosInstance.post(`editTechnician`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        ticket_id: TicketId,
        requested_parts: RequestedParts,
        old_part_image: imageUrls,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetSericeOTP(ticketId) {
  try {
    const response = await appApiInstance.post("/asset/service/otp", {
      ticket_id: ticketId,
    });
    if (response.data.data.status != 500) {
      return response.data;
    } else {
      throw new Error("Service OTP generation failed");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function RaiseServiceApprovalRequest({ ticketId, technician }) {
  try {
    const resData = await axiosInstance.post("/storeTicketRequests", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      ticketId,
      technician,
    });
    if (resData.status == 200) {
      return resData.data;
    }
  } catch (error) {
    console.log(error);
    return { error: error.response.data };
  }
}
export {
  UpdateTechnicianForTicket,
  UpdateCompleteTicketData,
  GetPartsForVehicle,
  RequestPartsForTicket,
  GetSericeOTP,
  RaiseServiceApprovalRequest,
};
