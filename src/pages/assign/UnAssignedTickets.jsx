import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { defaultDateFormat } from "../../utils/TimeFormatter";
import { Link } from "react-router-dom";
import { GetUnAssignedTickets } from "../../service/assign.service";
import { Pagination, ConfigProvider } from "antd";
const UnAssignedTickets = () => {
  const [UnAssignedTicketData, setUnAssignedTicketData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const pageLimit = 40;
  const [isLoading, setIsLoading] = useState(false);

  // Fetch UnAssigned Tickets
  const FetchUnAssignedTickets = async () => {
    try {
      const Tickets = await GetUnAssignedTickets();
      setUnAssignedTicketData(Tickets);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  useEffect(() => {
    FetchUnAssignedTickets();
  }, []);

  // Serach Filter Implementation
  useEffect(() => {
    let filteredArray;
    if (searchFilter === "") {
      filteredArray = [...UnAssignedTicketData];
    } else {
      filteredArray = UnAssignedTicketData.filter((ticket) =>
        ticket.vehicleID.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    setFilteredData(filteredArray);
  }, [searchFilter, UnAssignedTicketData]);

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
    <section className="flex flex-col gap-3 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-xl  md:text-2xl  font-[600]">
          New Service Requests
        </h1>
        <div className="flex items-center border border-slate-400 focus:ring-gray-500 px-2 py-0 rounded-lg w-max">
          <Search color="grey" className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search Vehicle"
            className="px-2 border-none  focus:ring-0 w-max py-1 outline-none"
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </header>
      {/* Table Section */}
      <Table theme={TableTheme}>
        <TableHead className="text-[#363636]">
          <TableHeadCell className="p-1 text-left">#</TableHeadCell>
          <TableHeadCell>Ticket Number</TableHeadCell>
          <TableHeadCell className="text-center">Vehicle Number</TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Open Date
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">Type</TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">
            Customer Name
          </TableHeadCell>
          <TableHeadCell className="p-4 py-5 text-center">Action</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y text-[#444A6D] font-normal">
          {filteredData.length > 0 &&
            filteredData
              .slice(page * pageLimit - pageLimit, page * pageLimit)
              .map((ticket, index) => {
                return (
                  <TableRow key={ticket.ticketId} className="bg-white">
                    <TableCell className=" p-1 text-left text-gray-900">
                      {index + 1 + (page - 1) * pageLimit}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900">
                      {ticket.ticketId}
                    </TableCell>
                    <TableCell className="text-center">
                      {ticket.vehicleID}
                    </TableCell>
                    <TableCell className="text-center">
                      {ticket.date ? defaultDateFormat(ticket.date) : "NA"}
                    </TableCell>
                    <TableCell className="text-center">{ticket.type}</TableCell>
                    <TableCell className="text-center">
                      {ticket.customerName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        to={`/assign/${ticket.ticketId}`}
                        className="border border-[#FF8284] px-4 py-1 rounded-md text-[#FF5733] bg-[#EF2F690D]"
                      >
                        Assign
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
              defaultCurrent={1}
              showSizeChanger={false}
              total={UnAssignedTicketData.length}
            />
          </ConfigProvider>
        )}
      </footer>
    </section>
  );
};

export default UnAssignedTickets;
