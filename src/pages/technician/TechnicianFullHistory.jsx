import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { GetTechnicianHistory } from "../../service/technician.service";
import { useAuth } from "../../hooks/AuthProvider";
import Loader from "../../components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { ConfigProvider, Pagination, Select, DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { Search } from "lucide-react";
import { GetAllRequestTypes } from "../../service/servicerequest.service";
import StatusBadgeVariants from "../../utils/StatusBadgeVariants";

const TechnicianFullHistory = () => {
  const [searchParams] = useSearchParams();
  const [TechnicianName, setTechnicianName] = useState(
    searchParams.get("technician")
  );
  const [RequestTypes, setRequestTypes] = useState([]);
  const { location } = useAuth();
  const [ticketData, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [Filters, setFilters] = useState({
    type: null,
    status: null,
    startDate: null,
    endDate: null,
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageLimit = 40;

  //Fetch all Request Types
  const FetchRequestTypes = async () => {
    try {
      const RequestTypes = await GetAllRequestTypes();
      setRequestTypes(RequestTypes);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  //Fetch Tickets of Particular Technician
  const FetchTicketData = async () => {
    setIsLoading(true);
    try {
      const data = await GetTechnicianHistory(TechnicianName, location);
      setTicketData(data.ticketData);
    } catch {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchRequestTypes();
    FetchTicketData();
  }, []);

  // Filters Implementation
  useEffect(() => {
    let filteredArray = ticketData.filter((ticket) => {
      if (Filters.type && ticket.type !== Filters.type) {
        return false;
      }
      if (Filters.status && ticket.status !== Filters.status) {
        return false;
      }
      if (Filters.startDate && Filters.endDate) {
        const ticketDate = new Date(ticket.date);
        const startDate = new Date(Filters.startDate.startOf("day"));
        const endDate = new Date(Filters.endDate.endOf("day"));
        return ticketDate >= startDate && ticketDate <= endDate;
      }
      if (searchFilter === "") {
        return true;
      }
      return ticket.vehicleID
        .toLowerCase()
        .includes(searchFilter.toLowerCase());
    });
    setFilteredData(filteredArray);
  }, [searchFilter, ticketData, Filters]);

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

  const urlparam = new URLSearchParams({ technician: TechnicianName });
  return (
    <>
      <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
        <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
          <span className="flex items-center gap-3 text-2xl font-semibold">
            {`Complete Details - ${TechnicianName}`}
          </span>
          <div className="flex items-center px-2 py-0 rounded-lg w-max"></div>
        </header>
        {/* Header */}
        <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Request Status Filter */}
            <Select
              defaultValue={"All"}
              style={{ width: 130 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
              options={[
                { value: null, label: "All" },
                { value: "In Progress", label: "In Progress" },
                { value: "To Do", label: "To Do" },
                { value: "Done", label: "Done" },
              ]}
            />
            {/* Request Date Filter */}
            <RangePicker
              onChange={(dates) => {
                setFilters((prev) => ({
                  ...prev,
                  startDate: dates ? dates[0] : null,
                  endDate: dates ? dates[1] : null,
                }));
              }}
            />
            {/* RequestType Filter */}
            <Select
              defaultValue={null}
              style={{ width: 180 }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
              options={[
                { value: null, label: "All Requests" },
                ...RequestTypes.map((type) => ({
                  value: type.name,
                  label: type.name,
                })),
              ]}
            />
          </div>
          {/* Search Filter */}
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
            <TableHeadCell className="text-center">
              Vehicle Number
            </TableHeadCell>
            <TableHeadCell className="p-4 py-5 text-center">Type</TableHeadCell>
            <TableHeadCell className="p-4 py-5 text-center">
              Subscriber
            </TableHeadCell>
            <TableHeadCell className="p-4 py-5 text-center">
              Status
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y text-[#444A6D] font-normal">
            {filteredData.length > 0 &&
              filteredData
                .slice(page * pageLimit - pageLimit, page * pageLimit)
                .map((ticket, index) => {
                  return (
                    <TableRow
                      key={ticket.ticketId}
                      className="bg-white cursor-pointer hover:bg-slate-100"
                      onClick={() =>
                        navigate(`/service/requests/${ticket.ticketId}`)
                      }
                    >
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
                        {ticket.type}
                      </TableCell>
                      <TableCell className="text-center">
                        {ticket.customerName}
                      </TableCell>
                      <TableCell className="text-center text-nowrap">
                        <span
                          className={`border px-3 py-1 ${
                            StatusBadgeVariants[ticket.status]
                          }`}
                        >
                          {ticket.status}
                        </span>
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
        {/* Pagination */}
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
                total={filteredData.length}
                hideOnSinglePage
              />
            </ConfigProvider>
          )}
        </footer>
      </section>
    </>
  );
};

export default TechnicianFullHistory;
