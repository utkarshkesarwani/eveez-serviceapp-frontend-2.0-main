import axiosInstance from "./api";

async function UpdateExistingUser(payload) {
  try {
    const response = await axiosInstance.post(`/updatetechniciancreds`, {
      key: import.meta.env.VITE_SERVER_KEY,
      data: payload,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { UpdateExistingUser };