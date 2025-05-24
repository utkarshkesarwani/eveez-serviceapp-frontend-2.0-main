import React, { useState } from "react";
import axiosInstance from "../../service/api";

const PdiForm = ({ setCustomerDetails, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    vehicle_no: "",
    mob_number: "",
    email: "",
    location: "",
    chassis_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCustomerDetails(formDetails);

    const payload = {
      ...formDetails,
      message: "You need to add this vehicle details to hubapp",
    };

    try {
      const response = await axiosInstance.post("nonexistingvehicle", {
        key: import.meta.env.VITE_SERVER_KEY,
        token: localStorage.getItem("token"),
        data: payload,
      });
    } catch (err) {
      console.error("Error submitting vehicle details:", err);
    }
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      setShowForm(true);
    } else {
      onClose();
    }
  };

  if (!showForm) {
    return (
      <div className="flex flex-col items-center gap-5 p-6">
        <p className="text-lg font-bold text-red-500 mb-4">Vehicle Data not Found!</p>
        <p className="text-center mb-4">Do you want to add Vehicle details to Continue Service?</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleConfirmation(true)}
            className="px-4 py-2 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          >
            Yes
          </button>
          {/* <button
            onClick={onClose}
            className="px-4 py-2 border-[#FF5733] bg-white text-[#FF5733] font-semibold rounded-md border"
          >
            No
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex justify-center items-center">
        <img src="/PdiImage.png" alt="PDI" className="w-24 h-24" />
      </header>
      <form className="grid grid-cols-1 gap-2" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-[16px]">
              Customer Name
            </label>
            <input
              type="text"
              id="name"
              value={formDetails.name}
              onChange={(e) =>
                setFormDetails((prev) => ({ ...prev, name: e.target.value }))
              }
              className="rounded-md py-1.5"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="vehicle_no" className="font-medium text-[16px]">
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicle_no"
              value={formDetails.vehicle_no}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  vehicle_no: e.target.value,
                }))
              }
              className="rounded-md py-1.5"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="mob_number" className="font-medium text-[16px]">
              Mobile Number
            </label>
            <input
              type="text"
              id="mob_number"
              value={formDetails.mob_number}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  mob_number: e.target.value,
                }))
              }
              className="rounded-md py-1.5"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-[16px]">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formDetails.email}
              onChange={(e) =>
                setFormDetails((prev) => ({ ...prev, email: e.target.value }))
              }
              className="rounded-md py-1.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="font-medium text-[16px]">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formDetails.location}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="rounded-md py-1.5"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="chassis_number" className="font-medium text-[16px]">
              Chassis Number
            </label>
            <input
              type="text"
              id="chassis_number"
              value={formDetails.chassis_number}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  chassis_number: e.target.value,
                }))
              }
              className="rounded-md py-1.5"
              required
            />
          </div>
        </div>
        <footer className="flex justify-center mt-3">
          <button
            type="submit"
            className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          >
            Submit
          </button>
        </footer>
      </form>
    </div>
  );
};

export default PdiForm;