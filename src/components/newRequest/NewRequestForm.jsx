import React, { useState } from "react";
import SearchVehicle from "./SearchVehicle";
import CustomerDetails from "./CustomerDetails";
import RequestDetails from "./RequestDetails";
import RequestParts from "./RequestParts";
import { useAuth } from "../../hooks/AuthProvider";
import Preview from "./Preview";
import toast from "react-hot-toast";
import { CreateNewRequest } from "../../service/new-request.service";
import Result from "./Result";

const NewRequestForm = () => {
  const { userRole, userName } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketResponse, setTicketResponse] = useState(null);
  const [requestDetails, setRequestDetails] = useState({
    assigned_to: userRole === "Technician" ? userName : null,
    issue_description: "",
    issue_type: [],
    odometer_reading: "",
    request_type: null,
    role: userRole,
    status: "To Do",
    spare_parts: [],
    requested_parts: [],
    issue_photo: [],
    closure_date: "",
  });

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };
  const createRequest = async () => {
    const payload = {
      ...requestDetails,
      customer_name: customerDetails.name,
      customer_mobile: customerDetails.mob_number,
      customer_email: customerDetails.email,
      location: customerDetails.location,
      vehicle: customerDetails.vehicle_no,
      hub: customerDetails.hub,
    };
    try {
      setIsLoading(true);
      const res = await CreateNewRequest(payload);
      setTicketResponse(res);
    } catch (err) {
      setTicketResponse(err.response.data);
      toast.error("Error Adding Ticket");
    } finally {
      nextStep();
      setIsLoading(false);
    }
  };

  const steps = [
    <SearchVehicle
      nextStep={nextStep}
      setCustomerDetails={setCustomerDetails}
    />,
    <CustomerDetails
      nextStep={nextStep}
      prevStep={prevStep}
      customerDetails={customerDetails}
      setCustomerDetails={setCustomerDetails}
    />,
    <RequestDetails
      nextStep={nextStep}
      prevStep={prevStep}
      requestDetails={requestDetails}
      setRequestDetails={setRequestDetails}
      customerDetails={customerDetails}
    />,
    userRole === "Technician" ? (
      <RequestParts
        nextStep={nextStep}
        prevStep={prevStep}
        requestDetails={requestDetails}
        setRequestDetails={setRequestDetails}
      />
    ) : null,
    <Preview
      prevStep={prevStep}
      customerDetails={customerDetails}
      requestDetails={requestDetails}
      createRequest={createRequest}
      isLoading={isLoading}
    />,
    <Result response={ticketResponse} />,
  ].filter(Boolean);

  return <section>{steps[currentStepIndex]}</section>;
};

export default NewRequestForm;
