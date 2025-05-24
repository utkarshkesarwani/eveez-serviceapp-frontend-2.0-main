import React, { useEffect, useState } from "react";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import NoResult from "../assets/NoData.svg";
import toast from "react-hot-toast";
import { GoUpload } from "react-icons/go";
import { HiOutlineEye } from "react-icons/hi";
import { UploadImageAndGetUrls } from "../service/s3.service";
import { MdOutlineDone } from "react-icons/md";

// Table Styling
const TableTheme = {
  root: {
    base: "w-full text-center text-sm font-semibold text-black shadow-none border-none bg-white",
    shadow: "",
    wrapper: "relative",
  },
  body: {
    base: "",
    cell: {
      base: "px-6 py-4 ",
    },
  },
  head: {
    base: "text-xs uppercase",
    cell: {
      base: "px-6 py-3",
    },
  },
};

const UsedUnusedParts = ({ TicketData, spareParts, _id, vehicleNumber }) => {
  console.log("partsData", spareParts);
  const [partsData, setPartsData] = useState(spareParts);
  const [unusedPartsImages, setUnusedPartsImages] = useState([]);
  const [loadingStates, setLoadingStates] = useState(Array(spareParts.length).fill(false));
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const updateUsedParts = async (index, usedCount) => {
    // console.log("token",localStorage?.getItem("token"));
    // console.log("_id",_id);
    // console.log("usedcount",usedCount);
    // console.log("partId",partsData[index]._id);
    // console.log("unusedCount",Number(partsData[index]?.count) - usedCount);

    try {
      const response = await fetch(`https://eveez.in:3906/used-unused-part`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "HSw@4cqd$%DFs2@",
          token: localStorage?.getItem("token"),
          id: _id,
          used_count: usedCount,
          partId: partsData[index]?._id,
          unused_count: Number(partsData[index]?.count) - usedCount,
        }),
      });
      const resData = await response.json();
      // console.log("Response",resData);
      // setData(resData.spare_parts);
      // setRequestDetails(resData);
      toast.success("Used Parts Count Updated Successfully");
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  const fetchRequestedParts = async () => {
    try {
    } catch (e) {}
  };

  const fetchAllUnusedPartsImages = async () => {
    try {
      if (!partsData.length) {
        setUnusedPartsImages([]);
      }
      const partImgArr = [];
      for (let part of partsData) {
        if (part.unused_part_image) {
          partImgArr.push(part.unused_part_image);
        }
      }
      setUnusedPartsImages(partImgArr);
    } catch (e) {
      setUnusedPartsImages([]);
    }
  };

  const increaseCount = (index, unusedCount) => {
    console.log("increaseCount() unusedCount", unusedCount);

    if (unusedCount < partsData[index]?.count) {
      const updatedPartsData = [...partsData];
      unusedCount = Number(unusedCount) + 1;
      const usedCount = partsData[index]?.count - unusedCount;
      updatedPartsData[index].unused_count = unusedCount;
      updatedPartsData[index].used_count =
        updatedPartsData[index].count - unusedCount;
      setPartsData(updatedPartsData);
      updateUsedParts(index, usedCount);
    } else {
      toast.error("Unused Parts can not be greater than Assigned Parts");
    }
  };

  const decreaseCount = (index, unusedCount) => {
    if (unusedCount > 0) {
      const updatedPartsData = [...partsData];
      unusedCount = Number(unusedCount) - 1;
      const usedCount = partsData[index]?.count - unusedCount;
      updatedPartsData[index].unused_count = unusedCount;
      updatedPartsData[index].used_count =
        updatedPartsData[index].count - unusedCount;
      setPartsData(updatedPartsData);
      updateUsedParts(index, usedCount);
    } else {
      toast.error("Number of Unused parts can not be Negative");
    }
  };

  const uploadUnusedPartsImages = async (e, index) => {
    setLoadingStates((prev) => {
      const newLoadingStates = [...prev];
      newLoadingStates[index] = true; // Set loading for this row
      return newLoadingStates;
    });

    const files = Array.from(e.target.files);
    let fileSizeExceeded = false;

    const formData = new FormData();
    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        fileSizeExceeded = true;
      } else {
        formData.append("images", file);
      }
    });

    if (fileSizeExceeded) {
      setErrorMessage("File size cannot exceed 2MB");
      setLoadingStates((prev) => {
        const newLoadingStates = [...prev];
        newLoadingStates[index] = false;
        return newLoadingStates;
      });
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
      setUnusedPartsImages(res.imageUrls);

      const updatedTicketData = { ...TicketData };
      updatedTicketData.spare_parts[index].part_image.unused_part_image.push(
        res.imageUrls
      );
      setPartsData([...updatedTicketData.spare_parts]);
      console.log("TT", TicketData);
      setLoadingStates((prev) => {
        const newLoadingStates = [...prev];
        newLoadingStates[index] = false;
        return newLoadingStates;
      });
    } catch (err) {
      console.log("e", err);
      setLoadingStates((prev) => {
        const newLoadingStates = [...prev];
        newLoadingStates[index] = false;
        return newLoadingStates;
      });
      toast.error("Error Uploading Images");
    }
  };

  useEffect(()=>{
    console.log(";;",loadingStates)

  },[loadingStates])
  useEffect(() => {
    fetchRequestedParts();
    fetchAllUnusedPartsImages();
  }, []);

  return (
    <div className="w-full">
      <Table theme={TableTheme} className="w-full">
        <TableHead className="text-[#363636]">
          <TableHeadCell className="text-center">Parts Name</TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Approved Parts
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Used Parts
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Unused Parts
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Unused Parts Images
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y text-[#444A6D] font-normal">
          {partsData.length > 0 &&
            partsData.map((part, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className=" p-1 text-left text-gray-900 text-center">
                    {part.product_name}
                  </TableCell>
                  <TableCell className=" p-1 text-left text-gray-900 text-center">
                    {part.used_count + part.unused_count}
                  </TableCell>
                  <TableCell className=" p-1 text-left text-gray-900 text-center">
                    {part.used_count}
                  </TableCell>
                  <TableCell className=" p-1 text-left text-gray-900 text-center">
                    <button
                      className="mx-2 border-solid border-[1px] border-[#ff8d73e0] py-[2px] px-[10px] rounded-md"
                      style={{
                        boxShadow: "2px 2px 4px 1px rgba(83, 83, 83, 0.4)",
                      }}
                      onClick={() => decreaseCount(index, part?.unused_count)}
                    >
                      -
                    </button>

                    {part?.count - part?.used_count}
                    <button
                      className="mx-2 border-solid border-[1px] border-[#04a778e0] py-[2px] px-[10px] rounded-md"
                      style={{
                        boxShadow: "2px 2px 4px 1px rgba(83, 83, 83, 0.4)",
                      }}
                      onClick={() => increaseCount(index, part?.unused_count)}
                    >
                      +
                    </button>
                  </TableCell>
                  <TableCell className="flex justify-center text-gray-900 text-center">
                    <div className="relative">
                      <button
                        onClick={() =>
                          document.getElementById(`fileInput-${index}`).click()
                        }
                      >
                        <GoUpload size={18} />
                      </button>
                      <input
                        type="file"
                        id={`fileInput-${index}`}
                        style={{ display: "none" }}
                        onChange={(e) => uploadUnusedPartsImages(e, index)}
                      />
                      {errorMessage && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          {errorMessage}
                        </p>
                      )}
                    </div>
                    <span className="ml-4 text-green-500">
                    {part.part_image.unused_part_image.length ? (
                        loadingStates[index] ? ( 
                          <Spinner/>
                        ) : (
                          <MdOutlineDone />
                        )
                      ) : (
                        <div className="ml-4"></div>
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            
        </TableBody>
      </Table>
      {/* {partsData.length>0 && 
     <div className="flex flex-col gap-2 sm:col-span-2">
             <label htmlFor="" className="font-medium text-[16px]">
               Old Parts Images <sup className="text-red-500"> Max size 2Mb</sup>
             </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {partsData.unusedpart &&
              TicketData.old_parts_images.length > 0 ? (
                TicketData.old_parts_images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`New Part Image ${index + 1}`}
                  />
                ))
              ) : (
                <span>No old parts images uploaded</span>
              )}
            </div>
            <input
              type="file"
              multiple
              onChange={handleOldPartsImageChange}
              className="mt-2"
            />
            {errorMessage && (
              <p style={{ color: "red", fontSize: "12px" }}>{errorMessage}</p>
            )}
          </div> 
      }  */}
      {partsData.length == 0 && (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NoResult} alt="No Data" width={100} height={100} />
          <p className="text-center mb-10">No Data</p>
        </div>
      )}
    </div>
  );
};

export default UsedUnusedParts;
