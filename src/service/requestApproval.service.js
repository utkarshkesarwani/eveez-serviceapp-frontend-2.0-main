import axiosInstance, { appApiInstance } from "./api";

export const GetAllRequests = async (status) => {
  try {
    const resData = await axiosInstance.post("/getTicketRequests",{
      key: import.meta.env.VITE_SERVER_KEY,
      token: localStorage.getItem("token"),
      status
    });
    return resData.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeRequestStatus = async ({status,ticketId}) => {
    try {
      const resData = await axiosInstance.post("/handleRequestStatus",{
        key: import.meta.env.VITE_SERVER_KEY,
        token: localStorage.getItem("token"),
        status,
        ticketId
      });
      return resData.data;
    } catch (error) {
      throw error;
    }
  };

