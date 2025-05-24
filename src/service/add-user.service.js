import axiosInstance from "./api";

async function CreateNewUser(Payload) {
  try {
    const response = await axiosInstance.post(`/adduser`, {
      key: import.meta.env.VITE_SERVER_KEY,
      data: Payload,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}


export { CreateNewUser };


