import React, { useState } from "react";
import { GetDetailsByVehicleId } from "../../service/new-request.service";
import { Check, X } from "lucide-react";
import PdiForm from "./PdiForm";

const SearchVehicle = ({ nextStep, setCustomerDetails }) => {
  const [searchNumber, setSearchNumber] = useState("");
  const [isVerified, setIsVerified] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdiForm, setShowPdiForm] = useState(false);

  const VerifyVehicleNumber = async () => {
    setIsLoading(true);
    try {
      const data = await GetDetailsByVehicleId(searchNumber.toUpperCase());
      setCustomerDetails(data[0]);
      setIsVerified(true);
    } catch (err) {
      setIsVerified(false);
      setShowPdiForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdiFormSubmit = (customerDetails) => {
    setCustomerDetails(customerDetails);
    setShowPdiForm(false);
    nextStep();
  };

  if (showPdiForm) {
    return (
      <PdiForm
        setCustomerDetails={handlePdiFormSubmit}
      />
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 items-center">
        <label htmlFor="vehicle" className="text-lg">
          Enter Vehicle Number <sup className="text-red-500">*</sup>
        </label>
        <div className="border border-slate-400 flex justify-between items-center px-2">
          <input
            type="text"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            className="outline-none border-none focus:ring-0"
          />
          {isVerified != null ? (
            !isVerified ? (
              <X color="red" />
            ) : (
              <Check color="green" />
            )
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center">
        <button
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md w-max"
          onClick={VerifyVehicleNumber}
        >
          Verify
        </button>

        <button
          disabled={!isVerified}
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md w-max disabled:bg-slate-300 disabled:cursor-not-allowed"
          onClick={nextStep}
        >
          Continue
        </button>
      </div>
    </section>
  );
};

export default SearchVehicle;
