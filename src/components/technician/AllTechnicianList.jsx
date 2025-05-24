import React, { useState, useEffect } from "react";
import { ConfigProvider, Pagination } from "antd";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { GetTechnicianRecords } from "../../service/technician.service";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

const AllTechnicianList = () => {
  const [TechnicianList, setTechnicianList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageLimit = 40;
  const { userLocation } = useAuth();
  const FetchTechnicianRecords = async () => {
    setIsLoading(true);
    try {
      const Records = await GetTechnicianRecords(userLocation);
      setTechnicianList(Records);
    } catch (err) {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchTechnicianRecords();
  }, [userLocation]);
  // Serach Filter Implementation
  useEffect(() => {
    let filteredArray;
    if (searchFilter === "") {
      filteredArray = [...TechnicianList];
    } else {
      filteredArray = TechnicianList.filter((technician) =>
        technician.name.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    setFilteredData(filteredArray);
  }, [searchFilter, TechnicianList]);

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

  return (
    <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-xl  md:text-2xl  font-[500]">Technician List</h1>{" "}
        <div className="flex items-center border border-slate-400 focus:ring-gray-500 px-2 py-0 rounded-lg w-max">
          <Search color="grey" className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search Technician"
            className="px-2 border-none  focus:ring-0 w-max py-1 outline-none"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </header>
      {/* Table Section */}
      <Table theme={TableTheme}>
        <TableHead className="text-[#363636]">
          <TableHeadCell className="p-1 text-left">#</TableHeadCell>
          <TableHeadCell className="text-center">Technician Name</TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Today Close
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Monthly Close
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Weekly Close
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Pending Tickets
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Service History
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y text-[#444A6D] font-normal">
          {filteredData.length > 0 &&
            filteredData
              .slice(page * pageLimit - pageLimit, page * pageLimit)
              .map((technician, index) => {
                const searchParams = new URLSearchParams({
                  technician: technician.name,
                });
                return (
                  <TableRow key={index} className="bg-white">
                    <TableCell className=" p-1 text-left text-gray-900">
                      {index + 1}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center font-medium text-gray-900">
                      {technician.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {technician.today}
                    </TableCell>
                    <TableCell className="text-center">
                      {technician.monthly}
                    </TableCell>
                    <TableCell className="text-center">
                      {technician.weekly}
                    </TableCell>
                    <TableCell className="text-center">
                      {technician.incomplete}
                    </TableCell>
                    <TableCell className="text-center text-nowrap">
                      <Link
                        to={{
                          pathname: "/technician-records/stats",
                          search: `${searchParams}`,
                        }}
                        className="border px-3 py-1 rounded-md bg-[#FF57330F] text-[#FF5733] border-[#FF5733]"
                      >
                        View History
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      {/* Loader and NoData Display */}
      {filteredData.length == 0 && (
        <Loader
          isLoading={isLoading}
          Title="No Data Found"
          height={300}
          width={300}
        />
      )}
      <footer className="flex justify-center">
        {filteredData && (
          <ConfigProvider
            theme={{
              components: {
                Pagination: {
                  // itemActiveBg: "#FF5733",
                  itemActiveColor: "#ffff",
                  itemActiveBorderColor: "green",
                },
              },
            }}
          >
            <Pagination
              size="xl"
              onChange={(page, pageSize) => setPage(page)}
              defaultPageSize={pageLimit}
              defaultCurrent={3}
              showSizeChanger={false}
              total={filteredData.length}
              hideOnSinglePage
            />
          </ConfigProvider>
        )}
      </footer>
    </section>
  );
};

export default AllTechnicianList;
