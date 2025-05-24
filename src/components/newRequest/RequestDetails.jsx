import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  GetAllIssueTypes,
  GetAllRequestTypes,
} from "../../service/new-request.service";
import { Select } from "antd";
import TechnicianSelect from "../TechnicianSelect";
import { UploadImageAndGetUrls } from "../../service/s3.service";
import { useAuth } from "../../hooks/AuthProvider";
import ImageResizer from "react-image-file-resizer";

const RequestDetails = ({
  prevStep,
  nextStep,
  requestDetails,
  setRequestDetails,
  customerDetails,
}) => {
  const [requestTypes, setRequestTypes] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const { userRole } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const FetchIssueTypes = async () => {
    try {
      const data = await GetAllIssueTypes();
      setIssueTypes(data.data);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  const FetchRequestTypes = async () => {
    try {
      const data = await GetAllRequestTypes();
      setRequestTypes(data);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  useEffect(() => {
    FetchIssueTypes();
    FetchRequestTypes();
  }, []);

  //Resize image
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      ImageResizer.imageFileResizer(
        file,
        500,
        500,
        "JPEG",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });
  };

  // Upload Images to S3 When selected by User
  const handleImageChange = async (e) => {
    e.preventDefault();
    let fileSizeExceeded = false;
    const formData = new FormData();

    // Array.from(e.target.files).forEach((file) => {
    //   if (file.size > 2 * 1024 * 1024) {
    //     // 2MB limit
    //     fileSizeExceeded = true;
    //   } else {
    //     formData.append("images", file);
    //   }
    // });

    for (const file of Array.from(e.target.files)) {
      console.log("Uploading", file);
      const result = await resizeImage(file);
      console.log(result.size / 1024, file.size / 1024);

      const size = result.size / 1024;

      if (size >= 20248) {
        setErrorMessage("File size should not exceed 2MB.");
        fileSizeExceeded = false;
      } else {
        formData.append("images", result);
      }
    }

    if (fileSizeExceeded) {
      setErrorMessage("File size cannot exceed 2MB");
      return;
    } else {
      setErrorMessage("");
    }

    formData.append("vehicle_no", customerDetails.vehicle_no);
    formData.append("key", import.meta.env.VITE_SERVER_KEY);
    formData.append("token", localStorage.getItem("token"));

    try {
      const res = await UploadImageAndGetUrls(formData);
      setRequestDetails((prev) => ({
        ...prev,
        issue_photo: [...prev.issue_photo, ...res.imageUrls],
      }));
    } catch (err) {
      toast.error("Error Uploading Images");
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <header className="flex justify-center items-center">
        <img src="/Service_Request.png" alt="Img" />
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Odometer Reading
          </label>
          <input
            type="text"
            value={requestDetails.odometer_reading}
            className="rounded-md py-1.5"
            onChange={(e) =>
              setRequestDetails((prev) => ({
                ...prev,
                odometer_reading: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Status
          </label>
          <input
            type="text"
            value={requestDetails.status}
            disabled
            className="rounded-md py-1.5 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Issue Type
          </label>
          <Select
            placeholder="Select Issue Type"
            size="large"
            mode="multiple"
            value={RequestDetails.issue_type}
            className="focus:ring-0"
            allowClear
            onChange={(value) =>
              setRequestDetails((prev) => ({ ...prev, issue_type: value }))
            }
            options={issueTypes.map((issue) => ({
              label: issue.name,
              value: issue.name,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Request Type
          </label>
          <Select
            defaultValue={requestDetails.request_type}
            placeholder="Select Request Type"
            size="large"
            onChange={(value) =>
              setRequestDetails((prev) => ({ ...prev, request_type: value }))
            }
            options={[
              ...requestTypes.map((type) => ({
                value: type.name,
                label: type.name,
              })),
            ]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Issue Description
          </label>
          <textarea
            type="text"
            value={requestDetails.issue_description}
            rows={2}
            className="rounded-md py-1.5"
            onChange={(e) =>
              setRequestDetails((prev) => ({
                ...prev,
                issue_description: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Issue Images <sup className="text-red-500"></sup>
          </label>
          <input
            type="file"
            multiple
            className="rounded-md py-1.5 border border-slate-500 p-1 h-full"
            onChange={handleImageChange}
          />
          {errorMessage && (
            <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
          )}
        </div>
        {["Manager", "Admin"].includes(userRole) && (
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Assign To
            </label>
            <TechnicianSelect
              withWorkLoad={true}
              size="large"
              onChange={(value, name) => {
                setRequestDetails((prev) => ({
                  ...prev,
                  assigned_to: { name: value.name, id: value.key },
                }));
              }}
            />
          </div>
        )}
      </main>
      <footer className="flex justify-around items-center">
        <button
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
        >
          Next
        </button>
      </footer>
    </section>
  );
};

export default RequestDetails;
