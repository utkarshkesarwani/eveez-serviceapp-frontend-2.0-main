import React, { useEffect, useState } from "react";
import {
  GetPartsForVehicle,
  RequestPartsForTicket,
} from "../service/updateticket.service";
import { UploadImageAndGetUrls } from "../service/s3.service";
import toast from "react-hot-toast";
import ImageResizer from "react-image-file-resizer";
import { Select } from "antd";

const RequestParts = ({
  vehicleNumber,
  TicketId,
  setRequestPartsModal,
  setTicketData,
}) => {
  const [partOptions, setPartOptions] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [partsMap, setPartsMap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const FetchPartsForVehicle = async () => {
    setIsLoading(true);
    try {
      const Data = await GetPartsForVehicle(vehicleNumber);
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let fileSizeExceeded = false;

    const formData = new FormData();

    // const formData = new FormData();
    // files.forEach((file) => {
    //   if (file.size > 2 * 1024 * 1024) {
    //     // 2MB limit
    //     fileSizeExceeded = true;
    //   } else {
    //     formData.append("images", file);
    //   }
    // });

    for (const file of files) {
      console.log("Uploading", file);
      // const result = await resizeImage(file);
      // // console.log(result.size / 1024, file.size / 1024);

      // const size = result.size / 1024;

      // if (size >= 20248) {
      //   fileSizeExceeded = true;
      // } else {
      //   formData.append("images", result);
      // }
    }


    if (fileSizeExceeded) {
      setErrorMessage("File size cannot exceed 2MB");
      return;
    } else {
      setErrorMessage("");
    }

    setSelectedFiles(files);
    formData.append("vehicle_no", vehicleNumber);
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
      setImageUrls(res.imageUrls);
    } catch (err) {
      toast.error("Error Uploading Images");
    }
  };

  const HandleRequestParts = async () => {
    try {
      const res = await RequestPartsForTicket(
        TicketId,
        selectedParts,
        imageUrls
      );
      if (res.code === 1) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setRequestPartsModal(false);
    } catch (err) {
      toast.error("Request Failed");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="NewTechnican" className="text-left w-full">
          Select Parts
        </label>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "100%",
          }}
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
              <div key={part.product_name} className="w-full grid grid-cols-2">
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

      {/* <div className="flex flex-col gap-2">
        <label htmlFor="old_part_image" className="font-medium text-[16px]">
          Old Parts Images <sup className="text-red-500"> Max size 2Mb</sup>
        </label>
        <input
          type="file"
          id="old_part_image"
          multiple
          onChange={handleFileChange}
          className="rounded-md py-1.5"
        />
        {errorMessage && (
          <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
        )}
      </div> */}

      <footer className="w-full flex justify-center items-center">
        <button
          className="px-5 py-1 border border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md mr-3 w-max mt-2"
          onClick={HandleRequestParts}
        >
          Request Parts
        </button>
      </footer>
    </div>
  );
};

export default RequestParts;
