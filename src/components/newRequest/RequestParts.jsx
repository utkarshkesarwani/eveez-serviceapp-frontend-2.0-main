import React, { useEffect, useState } from "react";
import { GetPartsForVehicle } from "../../service/updateticket.service";
import { Select } from "antd";
import toast from "react-hot-toast";

const RequestParts = ({
  prevStep,
  nextStep,
  requestDetails,
  setRequestDetails,
}) => {
  const [partOptions, setPartOptions] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [partsMap, setPartsMap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const FetchPartsForVehicle = async () => {
    setIsLoading(true);
    try {
      const Data = await GetPartsForVehicle("");
      setPartOptions(Data);
      let temp = {};
      Data.forEach((part) => {
        temp[part.product_name] = part;
      });
      setPartsMap(temp);
    } catch (err) {
      console.log(err);
      toast.error("Unknown error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchPartsForVehicle();
  }, []);
  const updateProductCount = (productName, newCount) => {
    setSelectedParts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_name === productName
          ? { ...product, count: newCount }
          : product
      )
    );
  };

  const HandleRequestParts = async () => {
    try {
      setRequestDetails((prev) => ({
        ...prev,
        requested_parts: selectedParts,
      }));
    } catch (err) {
      toast.error("Request Failed");
    }
  };
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="NewTechnican">Select Parts</label>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "100%",
          }}
          loading={isLoading}
          placeholder="Select Parts"
          defaultValue={[]}
          onChange={(value) =>
            setSelectedParts(() => value.map((part) => partsMap[part]))
          }
          options={partOptions.map((part, index) => ({
            value: part.product_name,
            label: part.product_name,
            key: index,
          }))}
        />
      </div>

      <div className="w-full flex flex-col gap-3">
        {selectedParts &&
          selectedParts.map((part) => {
            return (
              <div className="w-full grid grid-cols-2">
                <span>{part.product_name}</span>
                <div className="flex gap-3 items-center justify-end">
                  <button
                    className="px-3 py-0.5 border border-slate-400 rounded-lg disabled:cursor-not-allowed"
                    disabled={part.count === 1}
                    onClick={() =>
                      updateProductCount(part.product_name, part.count - 1)
                    }
                  >
                    -
                  </button>
                  {part.count}
                  <button
                    className="px-3 py-0.5 border border-slate-400 rounded-lg"
                    onClick={() =>
                      updateProductCount(part.product_name, part.count + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <footer className="flex justify-around items-center">
        <button
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          onClick={HandleRequestParts}
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
        >
          Save
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

export default RequestParts;
