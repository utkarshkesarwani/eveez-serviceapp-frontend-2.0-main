import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import { defaultDateFormat } from "../../utils/TimeFormatter";
import { GetTicketData } from "../../service/assign.service";
import TechnicianSelect from "../../components/TechnicianSelect";
import { Select } from "antd";
import { useAuth } from "../../hooks/AuthProvider";
import { Modal } from "flowbite-react";
import ImageResizer from "react-image-file-resizer";
import {
  GetPartsForVehicle,
  UpdateCompleteTicketData,
  UpdateTechnicianForTicket,
  GetSericeOTP,
  RaiseServiceApprovalRequest,
} from "../../service/updateticket.service";
import { UploadImageAndGetUrls } from "../../service/s3.service";
import RequestParts from "../../components/RequestParts";
import { ModalTheme } from "../../utils/themes";
import OtpModal from "../../components/service/OtpModal";
// import UsedUnusedParts from "../../components/UsedUnusedParts";
import axiosInstance from "../../service/api";

const UpdateTicket = () => {
  const { TicketId } = useParams();
  const [TicketData, setTicketData] = useState(null);
  const [initialTicketData, setInitialTicketData] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [newTechnicianModal, setNewTechnicianModal] = useState(false);
  const [newTechnician, setNewTechnician] = useState(null);
  const [requestPartsModal, setRequestPartsModal] = useState(false);
  const [usedPartsModal, setUsedPartsModal] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newIssueImages, setNewIssueImages] = useState([]); // New state for tracking newly uploaded images
  const [isImageChanged, setIsImageChanged] = useState(false); // New state to track if images have been changed
  const [serviceOtp, setServiceOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpVerfied, setOtpVerified] = useState(false);
  const { userRole } = useAuth();

  // Fetch Ticket Data
  const FetchTicketData = async () => {
    setIsLoading(true);
    try {
      const Data = await GetTicketData(TicketId);
      setTicketData(Data);
      const copyOfData = JSON.parse(JSON.stringify(Data));
      setInitialTicketData(copyOfData);
    } catch (err) {
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };

  //Update Technican For a Ticket
  const UpdateTechnician = async () => {
    setIsLoading(true);
    try {
      if (!newTechnician) {
        throw "Select a Technician";
      }
      const Data = await UpdateTechnicianForTicket(TicketId, newTechnician);
      if (Data.code === 1) {
        toast.success("Technician Updated SuccessFully");
      } else {
        toast.error("Error updating Technician");
      }
      setTicketData(Data.details);
      setNewTechnicianModal(false);
    } catch (err) {
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };

  //this function handle new parts images
  const handleNewPartsImageChange = async (e) => {
    e.preventDefault();
    setIsImageUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    let isValid = true;

    // Validate file sizes
    // Array.from(e.target.files).forEach((file) => {
    //   if (file.size > 2 * 1024 * 1024) {
    //     // File size > 2MB
    //     setErrorMessage("File size should not exceed 2MB.");
    //     isValid = false;
    //   } else {
    //     formData.append("images", file);
    //   }
    // });

    for (const file of Array.from(e.target.files)) {
      // console.log("Uploading", file);
      const result = await resizeImage(file);
      // console.log(result.size / 1024, file.size / 1024);

      const size = result.size / 1024;

      if (size >= 20248) {
        setErrorMessage("File size should not exceed 2MB.");
        isValid = false;
      } else {
        formData.append("images", result);
      }
    }

    if (!isValid) {
      setIsImageUploading(false);
      return;
    }

    formData.append("vehicle_no", TicketData.vehicle_no);
    formData.append("key", import.meta.env.VITE_SERVER_KEY);
    formData.append("token", localStorage.getItem("token"));

    try {
      const res = await UploadImageAndGetUrls(formData);
      setTicketData((prev) => ({
        ...prev,
        new_parts_images: [...(prev.new_parts_images || []), ...res.imageUrls],
      }));
    } catch (err) {
      toast.error("Error Uploading New Parts Images");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleOldPartsImageChange = async (e) => {
    e.preventDefault();
    setIsImageUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    let isValid = true;

    // Validate file sizes
    Array.from(e.target.files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        // File size > 2MB
        setErrorMessage("File size should not exceed 2MB.");
        isValid = false;
      } else {
        formData.append("images", file);
      }
    });

    if (!isValid) {
      setIsImageUploading(false);
      return;
    }

    formData.append("vehicle_no", TicketData.vehicle_no);
    formData.append("key", import.meta.env.VITE_SERVER_KEY);
    formData.append("token", localStorage.getItem("token"));

    try {
      const res = await UploadImageAndGetUrls(formData);
      setTicketData((prev) => ({
        ...prev,
        old_parts_images: [...(prev.old_parts_images || []), ...res.imageUrls],
      }));
    } catch (err) {
      toast.error("Error Uploading Old Parts Images");
    } finally {
      setIsImageUploading(false);
    }
  };

  //Update Complete Ticket
  const UpdateCompleteTicket = async () => {
    if (TicketData.status === "Done") {
      if (
        TicketData.iot_number === "" ||
        Object.entries(TicketData.vehicle_image).length < 4
      ) {
        toast.error("Please Fill all the Details");
        return;
      }
    }
    setIsLoading(true);
    try {
      let updatedTicketData = { ...TicketData };
      
      if (updatedTicketData?.status == "Done") {
        if (userRole == "Technician" && !otpVerfied) {
          updatedTicketData.status = "In Progress";
        }
      }

      // Only include issue_photo in the payload if new images were uploaded
      if (isImageChanged) {
        updatedTicketData.issue_photo = newIssueImages;
      } else {
        // If no new images were uploaded, remove issue_photo from the payload
        delete updatedTicketData.issue_photo;
      }

      const data = await UpdateCompleteTicketData(updatedTicketData);
      if (data.code === 1) {
        toast.success(data.message);
        // Update TicketData with new images if any were uploaded
        if (isImageChanged) {
          setTicketData((prev) => ({ ...prev, issue_photo: newIssueImages }));
        }
        // Reset states after successful update
        setNewIssueImages([]);
        setIsImageChanged(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };

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

  //Upload Image
  const handleImageChange = async (e) => {
    e.preventDefault();
    setIsImageUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    let isValid = true;

    // Array.from(e.target.files).forEach(async(file) => {
    //   if (file.size > 2 * 1024 * 1024) {
    //     setErrorMessage("File size should not exceed 2MB.");
    //     isValid = false;
    //   } else {
    //     formData.append("images", file);
    //   }
    // });

    for (const file of Array.from(e.target.files)) {
      // console.log("Uploading", file);
      const result = await resizeImage(file);
      // console.log(result.size / 1024, file.size / 1024);

      const size = result.size / 1024;

      if (size >= 20248) {
        setErrorMessage("File size should not exceed 2MB.");
        isValid = false;
      } else {
        formData.append("images", result);
      }
    }

    if (!isValid) {
      setIsImageUploading(false);
      return;
    }

    formData.append("vehicle_no", TicketData.vehicle_no);
    formData.append("key", import.meta.env.VITE_SERVER_KEY);
    formData.append("token", localStorage.getItem("token"));

    try {
      const res = await UploadImageAndGetUrls(formData);
      setTicketData((prev) => ({
        ...prev,
        vehicle_image: [
          ...prev.vehicle_image,
          {
            name: e.target.name,
            image: res.imageUrls[0],
          },
        ],
      }));
    } catch (err) {
      toast.error("Error Uploading Images");
    } finally {
      setIsImageUploading(false);
    }
  };

  // Upload Images to S3 When selected by User
  const handleIssueImageChange = async (e) => {
    e.preventDefault();
    setIsImageUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    let isValid = true;

    // Validate file size
    // Array.from(e.target.files).forEach((file) => {
    //   if (file.size > 2 * 1024 * 1024) {
    //     setErrorMessage("File size should not exceed 2MB.");
    //     isValid = false;
    //   } else {
    //     formData.append("images", file);
    //   }
    // });

    for (const file of Array.from(e.target.files)) {
      // console.log("Uploading", file);
      const result = await resizeImage(file);
      // console.log(result.size / 1024, file.size / 1024);
      const size = result.size / 1024;

      if (size >= 20248) {
        setErrorMessage("File size should not exceed 2MB.");
        isValid = false;
      } else {
        formData.append("images", result);
      }
    }

    if (!isValid) {
      setIsImageUploading(false);
      return;
    }

    formData.append("vehicle_no", TicketData.vehicle_no);
    formData.append("key", import.meta.env.VITE_SERVER_KEY);
    formData.append("token", localStorage.getItem("token"));

    try {
      const res = await UploadImageAndGetUrls(formData);
      setNewIssueImages((prev) => [...prev, ...res.imageUrls]);
      setIsImageChanged(true); // Set this flag when new images are uploaded
    } catch (err) {
      toast.error("Error Uploading Issue Images");
    } finally {
      setIsImageUploading(false);
    }
  };

  const stockInInventory = async () => {
    try {
      //check if a part's final count is greater than initialCount.
      const currentSpareParts = TicketData.spare_parts; // current ticket data
      const initialSpareParts = initialTicketData.spare_parts; // initial ticket data
      console.log("Final Ticket Data", TicketData);
      console.log("Initial Ticket Data", initialTicketData);
      // console.log("current",currentSpareParts)
      let inventoryUpdatableParts = [];

      for (let i = 0; i < currentSpareParts.length; i++) {
        const currentPart = currentSpareParts[i];
        const initialPart = initialSpareParts.find(
          (part) => part._id === currentPart._id
        );

        if (initialPart) {
          const currentUnusedCount = currentPart.unused_count;
          const initialUnusedCount = initialPart.unused_count;

          if (currentUnusedCount > initialUnusedCount) {
            // Call the /stockin API if the unused_count has increased
            // await stockInOperation(currentPart, initialPart);
            const net_increased_parts_quantity =
              currentUnusedCount - initialUnusedCount;
            const updatedCurrentPart = {
              ...JSON.parse(JSON.stringify(currentPart)),
            };
            updatedCurrentPart.stockinCount = net_increased_parts_quantity;
            // console.log("updatedOBj",updatedObj);
            inventoryUpdatableParts.push({
              ...updatedCurrentPart,
              count: net_increased_parts_quantity,
            });
          }
          // else if (currentUnusedCount < initialUnusedCount) {
          //   // Call the /stockout API if the unused_count has decreased
          //   await stockOutOperation(currentPart, initialPart);
          // }
        }
      }

      await updateInventoryCount(inventoryUpdatableParts);
      await stockInOperation(inventoryUpdatableParts);
    } catch (e) {
      console.log(e);
    }
  };

  const updateInventoryCount = async (parts) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axiosInstance.post(`/updateinventorycount`, {
        key: import.meta.env.VITE_SERVER_KEY,
        token: localStorage.getItem("token"),
        data: {
          parts,
        },
      });
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  const stockInOperation = async (parts) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axiosInstance.post(`/stockininventory`, {
        key: import.meta.env.VITE_SERVER_KEY,
        token: localStorage.getItem("token"),
        data: {
          operation: "stockin",
          consumer_technician: user.name,
          parts,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const serviceApprovalRequest = async ({ ticketId, technician }) => {
    try {
      const requestRes = await RaiseServiceApprovalRequest({
        ticketId,
        technician,
      });
      if (!requestRes?.error) {
        toast.success(requestRes.message);
      }
      toast.error(requestRes.error.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const validateStatus = async () => {
    const { status } = TicketData;
    try {
      await stockInInventory();
      if (status == "In Progress" || status == "Done") {
        if (status === "Done") {
          if (
            TicketData.iot_number === "" ||
            Object.entries(TicketData.vehicle_image).length < 4
          ) {
            toast.error("Please Fill all the Details");
            return;
          }
        }

        // Get Otp From SQL Server
        const { data } = await GetSericeOTP(TicketId);
        if (data.length > 0) {
          //Show OTP MODAL
          if (status == "In Progress") {
            setServiceOtp(data[0]?.open_otp);
          } else {
            setServiceOtp(data[0]?.close_otp);
          }
          setShowOtpModal(true);
        } else {
          if (status == "Done") {
            if (userRole == "Technician") {
              await serviceApprovalRequest({
                ticketId: TicketData.ticket_id,
                technician: TicketData.assigned_to.technician,
              });
              UpdateCompleteTicket();
            } else {
              UpdateCompleteTicket();
            }
          } else {
            UpdateCompleteTicket();
          }
        }
      } else {
        UpdateCompleteTicket();
      }
      // window.location.reload();
    } catch (error) {
      //Raise Request
      toast.error("Something went Wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    FetchTicketData();
  }, []);

  console.log("INITIAL TICKET DATA", TicketData);
  useEffect(() => {
    if (otpVerfied) {
      UpdateCompleteTicket();
    }
  }, [otpVerfied]);

  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between items-center">
        <h1 className="text-lg  md:text-xl  font-[600]">
          Complete Details &nbsp;&gt;&nbsp;&nbsp;{`#${TicketId}`}
        </h1>
        {userRole === "Technician" && TicketData?.latestStatus !== "Done" && (
          <button
            className="px-5 py-1 border border-[#FF5733] bg-[#FF5733] text-white h-max font-semibold rounded-md focus:ring-0"
            onClick={() => setRequestPartsModal(true)}
          >
            Request Parts
          </button>
        )}
      </header>
      {/* Customer Details */}
      {TicketData && (
        <section className="p-2 py-4 border border-slate-300 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Customer Name
            </label>
            <input
              type="text"
              value={TicketData.customer_name}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Date
            </label>
            <input
              type="text"
              value={defaultDateFormat(TicketData.date)}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Vehicle Number
            </label>
            <input
              type="text"
              value={TicketData.vehicle}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Location
            </label>
            <input
              type="text"
              value={TicketData.location}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Mobile Number
            </label>
            <input
              type="text"
              value={TicketData.customer_mobile}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Email ID
            </label>
            <input
              type="text"
              value={TicketData.customer_email}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Issue Type
            </label>
            <input
              type="text"
              value={TicketData.issue_type.join(", ") || "NA"}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Odometer Reading
            </label>
            <input
              type="text"
              value={TicketData.odometer_reading}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Request Type
            </label>
            <input
              type="text"
              value={TicketData.request_type}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Issue Description
            </label>
            <input
              value={TicketData.issue_description}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Issue Images <sup className="text-red-500"></sup>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {isImageChanged ? (
                newIssueImages.map((image, index) => (
                  <img
                    key={`new-${index}`}
                    src={image}
                    alt={`New Issue Image ${index + 1}`}
                  />
                ))
              ) : TicketData.issue_photo.length > 0 ? (
                TicketData.issue_photo.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Issue Image ${index + 1}`}
                  />
                ))
              ) : (
                <span>No images Found</span>
              )}
            </div>
            <input type="file" multiple onChange={handleIssueImageChange} />
            {errorMessage && (
              <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
            )}
          </div>
        </section>
      )}
      {TicketData && (
        <section className="p-2 py-4 border border-slate-300 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex  col-span-1 ">
            <div className={`flex flex-col gap-2 w-full`}>
              <label htmlFor="" className="font-medium text-[16px]">
                Assigned To
              </label>
              <input
                type="text"
                value={TicketData.assigned_to.technician}
                className="rounded-md cursor-not-allowed py-1.5"
                disabled
              />
            </div>
            {/* <div className={`flex items-end ml-5 gap-2`}>
              <label htmlFor="" className="font-medium text-[16px]">
                <button
                  className="px-5 py-1.5 border border-[#FF5733] bg-[#FF5733] text-white h-max font-semibold rounded-md focus:ring-0"
                  onClick={() => setUsedPartsModal(true)}
                >
                  Update Unused Parts
                </button>
              </label>
            </div> */}
          </div>
          {["Manager", "Admin"].includes(userRole) && (
            <div className="flex justify-start items-center sm:mt-7">
              <button
                className="px-5 py-1.5 border border-[#FF5733] bg-[#FF5733] text-white h-max font-semibold rounded-md mr-3 focus:ring-0"
                onClick={() => setNewTechnicianModal(true)}
              >
                Change Technician
              </button>
            </div>
          )}

          <div className={`flex flex-col gap-2`}>
            <label htmlFor="" className="font-medium text-[16px]">
              Requested Parts
            </label>
            <input
              type="text"
              value={
                [
                  TicketData.requested_parts.map((part) => part.product_name),
                ].join(",") || "NA"
              }
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div>

          {/* <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Approved Parts
            </label>
            <input
              type="text"
              value={TicketData.spare_parts
                ?.map((part) => part.product_name)
                .join(", ")}
              className="rounded-md cursor-not-allowed py-1.5"
              disabled
            />
          </div> */}

          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              IOT Number <sup className="text-red-600">*</sup>
            </label>
            <input
              onChange={(e) =>
                setTicketData((prev) => ({
                  ...prev,
                  iot_number: e.target.value,
                }))
              }
              defaultValue={TicketData.iot_number}
              className="rounded-md py-1.5"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="" className="font-medium text-[16px]">
              Status <sup className="text-red-600">*</sup>
            </label>
            <Select
              defaultValue={TicketData.latestStatus}
              className="w-full"
              size="large"
              onChange={(value) =>
                setTicketData((prev) => ({ ...prev, status: value }))
              }
              options={[
                { value: "To Do", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Done", label: "Done" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2 col-start-1">
            <label htmlFor="" className="font-medium text-[16px]">
              Front View <sup className="text-red-500">*</sup>
            </label>
            {TicketData?.vehicle_image?.length &&
            TicketData?.vehicle_image?.filter(
              (image) => image.name == "front_view"
            )?.length > 0 ? (
              <img
                src={
                  TicketData?.vehicle_image?.length &&
                  TicketData?.vehicle_image?.filter(
                    (image) => image.name == "front_view"
                  )[0].image
                }
                alt={`front_view`}
              />
            ) : (
              <>
                <input
                  type="file"
                  name="front_view"
                  onChange={handleImageChange}
                  className="rounded-md cursor-not-allowed py-1.5"
                />
                {errorMessage && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Rear View <sup className="text-red-500">*</sup>
            </label>
            {TicketData?.vehicle_image?.length &&
            TicketData?.vehicle_image?.filter(
              (image) => image.name == "rear_view"
            ).length > 0 ? (
              <img
                src={
                  TicketData?.vehicle_image?.length &&
                  TicketData?.vehicle_image?.filter(
                    (image) => image.name == "rear_view"
                  )[0].image
                }
                alt={`rear_view`}
              />
            ) : (
              <>
                <input
                  type="file"
                  name="rear_view"
                  onChange={handleImageChange}
                  className="rounded-md cursor-not-allowed py-1.5"
                />
                {errorMessage && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Right View <sup className="text-red-500">*</sup>
            </label>

            {TicketData?.vehicle_image?.length &&
            TicketData?.vehicle_image?.filter(
              (image) => image.name == "right_view"
            ).length > 0 ? (
              <img
                src={
                  TicketData?.vehicle_image?.length &&
                  TicketData?.vehicle_image?.filter(
                    (image) => image.name == "right_view"
                  )[0].image
                }
                alt={`right_view`}
              />
            ) : (
              <>
                <input
                  type="file"
                  name="right_view"
                  onChange={handleImageChange}
                  className="rounded-md cursor-not-allowed py-1.5"
                />
                {errorMessage && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Left View <sup className="text-red-500">*</sup>
            </label>
            {TicketData?.vehicle_image?.length &&
            TicketData?.vehicle_image?.filter(
              (image) => image.name == "left_view"
            ).length > 0 ? (
              <img
                src={
                  TicketData?.vehicle_image?.length &&
                  TicketData?.vehicle_image?.filter(
                    (image) => image.name == "left_view"
                  )[0].image
                }
                alt={`left_view`}
              />
            ) : (
              <>
                <input
                  type="file"
                  name="left_view"
                  onChange={handleImageChange}
                  className="rounded-md cursor-not-allowed py-1.5"
                />
                {errorMessage && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errorMessage}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Add this new section for New Parts Images */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="" className="font-medium text-[16px]">
              New Parts Images <sup className="text-red-500"></sup>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TicketData.new_parts_images &&
              TicketData.new_parts_images.length > 0 ? (
                TicketData.new_parts_images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`New Part Image ${index + 1}`}
                  />
                ))
              ) : (
                <span>No new parts images uploaded</span>
              )}
            </div>
            <input
              type="file"
              multiple
              onChange={handleNewPartsImageChange}
              className="mt-2"
            />
            {errorMessage && (
              <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="" className="font-medium text-[16px]">
              Technician Comment
            </label>
            <textarea
              rows={3}
              value={TicketData.technician_comment || ""}
              onChange={(e) =>
                setTicketData((prev) => ({
                  ...prev,
                  technician_comment: e.target.value,
                }))
              }
              className="rounded-md py-1.5"
            />
          </div>
        </section>
      )}
      <footer className="flex items-center justify-center">
        <button
          className="px-5 py-1 border border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md mr-3"
          onClick={
            // UpdateCompleteTicket
            validateStatus
          }
        >
          Save
        </button>
      </footer>

      {/* Change Technician Modal */}
      <Modal
        theme={ModalTheme}
        show={newTechnicianModal}
        onClose={() => setNewTechnicianModal(false)}
      >
        <Modal.Header>Change Technician</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="NewTechnican">New Technician</label>
            <TechnicianSelect
              withWorkLoad={true}
              width={500}
              onChange={(value) => setNewTechnician(value)}
            />
            <button
              className="px-5 py-1 border border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md mr-3 w-max mt-2"
              onClick={UpdateTechnician}
            >
              Save
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Request Parts Modal */}
      <Modal
        theme={ModalTheme}
        show={requestPartsModal}
        onClose={() => setRequestPartsModal(false)}
      >
        <Modal.Header>Request Parts</Modal.Header>
        <Modal.Body>
          <RequestParts
            vehicleNumber={TicketData?.vehicle}
            TicketId={TicketData?.ticket_id}
            setRequestPartsModal={setRequestPartsModal}
            setTicketData={setTicketData}
          />
        </Modal.Body>
      </Modal>

      {/* Used Parts Modal */}
      {/* <Modal
        theme={ModalTheme}
        show={usedPartsModal}
        onClose={() => {
          setUsedPartsModal(false);
        }}
      >
        <Modal.Header className="py-3">Approved And Unused Parts</Modal.Header>
        <Modal.Body>
          <UsedUnusedParts
            TicketData={TicketData}
            vehicleNumber={TicketData?.vehicle}
            spareParts={TicketData ? TicketData.spare_parts : []}
            _id={TicketData?._id}
            // setRequestDetails={setRequestDetails}
            setUsedPartsModal={setUsedPartsModal}
          />
        </Modal.Body>
      </Modal> */}

      <OtpModal
        showModal={showOtpModal}
        otp={serviceOtp}
        verify={setOtpVerified}
        setShowModal={setShowOtpModal}
      />

      {!TicketData && (
        <Loader
          Title="No Data Found"
          isLoading={IsLoading}
          height={300}
          width={300}
        />
      )}
    </section>
  );
};

export default UpdateTicket;
