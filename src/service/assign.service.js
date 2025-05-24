import axiosInstance from "./api";
async function GetUnAssignedTickets() {
  try {
    const response = await axiosInstance.post("/unassignedrequests", {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function GetTicketData(TicketId) {
  try {
    const response = await axiosInstance.post(`/servicerequest/${TicketId}`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
    });
    return response.data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function AssignTicketToTechncian(TicketId, Technician) {
  try {
    const response = await axiosInstance.post(`/editManager/`, {
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      data: {
        ticket_id: TicketId,
        technician_id: Technician,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { GetUnAssignedTickets, GetTicketData, AssignTicketToTechncian };
