
import { Spinner } from "flowbite-react";

const Preview = ({
  prevStep,
  createRequest,
  customerDetails,
  requestDetails,
  isLoading
}) => {
  
  return (
    <section className="flex flex-col gap-5">
      <header className="flex justify-center items-center">
        <img src="/Confirm_Request.PNG" alt="Img" />
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Customer Name
          </label>
          <input
            type="text"
            value={customerDetails.name}
            disabled
            className="rounded-md  py-1.5 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Vehicle Number
          </label>
          <input
            type="text"
            value={customerDetails.vehicle_no}
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
            value={customerDetails.mob_number}
            className="rounded-md  py-1.5 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Email
          </label>
          <input
            type="text"
            value={customerDetails.email}
            className="rounded-md py-1.5"
            onChange={(e) =>
              setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Location
          </label>
          <input
            type="text"
            value={customerDetails.location}
            className="rounded-md cursor-not-allowed py-1.5"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Hub
          </label>
          <input
            type="text"
            value={customerDetails.hub}
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
            value={requestDetails.odometer_reading}
            className="rounded-md py-1.5"
            disabled
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
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Issue Description
          </label>
          <input
            type="text"
            value={requestDetails.issue_description}
            className="rounded-md py-1.5 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Issue Type
          </label>
          <input
            type="text"
            value={requestDetails.issue_type}
            disabled
            className="rounded-md py-1.5 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Request Type
          </label>
          <input
            type="text"
            value={requestDetails.request_type}
            disabled
            className="rounded-md py-1.5 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Assign To
          </label>
          <input
            type="text"
            value={requestDetails.assigned_to?.name}
            disabled
            className="rounded-md py-1.5 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="" className="font-medium text-[16px]">
            Images Preview
          </label>
          <div className="border border-slate-400 rounded-lg p-1 grid grid-cols-2 gap-3">
            {requestDetails.issue_photo.length > 0 ? (
              <div>
                {requestDetails.issue_photo.map((image) => (
                  <img src={image} alt="Issue Image" />
                ))}
              </div>
            ) : (
              <span className="p-2">No Images Found</span>
            )}
          </div>
        </div>
      </main>
      <footer className="flex justify-around items-center">
        <button
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          onClick={createRequest}
          className={`px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md
            ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
            `}
          disabled={isLoading}
        >
          {isLoading?<span className="flex items-center">Add Request<Spinner className="ml-2" /></span>:"Add Request"}  
        </button>
      </footer>
     
    </section>
  );
};




export default Preview;
