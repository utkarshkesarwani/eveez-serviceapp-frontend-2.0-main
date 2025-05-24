import React, { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getHubList } from "../../service/location.service";

const CustomerDetails = ({
  nextStep,
  prevStep,
  customerDetails,
  setCustomerDetails,
}) => {
  const [hubOptions, setHubOptions] = useState({});
  const customerLocation = customerDetails.location; // Extracting for better memoization

  useEffect(() => {
    const fetchHubList = async () => {
      try {
        const { data } = await getHubList();
        const result = data.reduce((acc, { location, hub_name }) => {
          acc[location] = acc[location] || [];
          acc[location].push(hub_name);
          return acc;
        }, {});

        console.log("Hub Data:", result);
        setHubOptions(result);
      } catch (error) {
        console.error("Error fetching hub list:", error);
      }
    };

    fetchHubList();
  }, []);

  const normalizedLocation =
    customerLocation === "Bengaluru" ? "Bangalore" : customerLocation;
  const availableHubs = useMemo(
    () => hubOptions[normalizedLocation] || [],
    [normalizedLocation, hubOptions]
  );

  return (
    <div className="flex flex-col gap-5">
      <header className="flex justify-center items-center">
        <img src="/Customer_Details.png" alt="" />
      </header>
      <main className="grid grid-cols-1 gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="customerName" className="font-medium text-[16px]">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={customerDetails.name}
            onChange={(e) =>
              setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))
            }
            className="rounded-md py-1.5"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="vehicleNumber" className="font-medium text-[16px]">
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicleNumber"
            value={customerDetails.vehicle_no}
            className="rounded-md cursor-not-allowed py-1.5"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="mobileNumber" className="font-medium text-[16px]">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            value={customerDetails.mob_number}
            className="rounded-md py-1.5"
            onChange={(e) =>
              setCustomerDetails((prev) => ({
                ...prev,
                mob_number: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-[16px]">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={customerDetails.email}
            className="rounded-md py-1.5"
            onChange={(e) =>
              setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="font-medium text-[16px]">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={customerDetails.location}
            className="rounded-md cursor-not-allowed py-1.5"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hub" className="font-medium text-[16px]">
            Hub
          </label>
          <select
            id="hub"
            value={customerDetails.hub || ""}
            onChange={(e) =>
              setCustomerDetails((prev) => ({ ...prev, hub: e.target.value }))
            }
            className="rounded-md py-1.5"
          >
            <option value="">Select Hub</option>
            {availableHubs.map((hub) => (
              <option key={hub} value={hub}>
                {hub}
              </option>
            ))}
          </select>
        </div>
      </main>
      <footer className="flex justify-around items-center mt-3">
        <button
          onClick={prevStep}
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (!customerDetails.hub) {
              toast.error("Please select a Hub");
              return;
            }
            nextStep();
          }}
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default CustomerDetails;
