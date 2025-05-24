import axiosInstance from "./api";

async function UploadImageAndGetUrls(formData) {
  try {
    const response = await axiosInstance.post("/gets3uploadurl", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        key: import.meta.env.VITE_SERVER_KEY,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { UploadImageAndGetUrls };
