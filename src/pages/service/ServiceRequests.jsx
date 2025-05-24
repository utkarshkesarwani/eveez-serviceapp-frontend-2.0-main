// import React, { useEffect, useState } from "react";
// import {
//   GetAllRequestTypes,
//   GetAllServiceRequests,
// } from "../../service/servicerequest.service";
// import toast from "react-hot-toast";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeadCell,
//   TableRow,
// } from "flowbite-react";
// import { ConfigProvider, Pagination, Select, DatePicker } from "antd";
// const { RangePicker } = DatePicker;
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// dayjs.extend(isBetween);
// import Loader from "../../components/Loader";
// import { Search } from "lucide-react";
// import RequestStats from "../../components/service/RequestStats";
// import StatusBadgeVariants from "../../utils/StatusBadgeVariants";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/AuthProvider";
// import { getHubList } from "../../service/location.service";

// const ServiceRequests = () => {
//   const [AllServiceRequests, setAllServiceRequests] = useState([]);
//   const [RequestTypes, setRequestTypes] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchFilter, setSearchFilter] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const navigate = useNavigate();
//   const pageLimit = 40;
//   const [Filters, setFilters] = useState({
//     type: null,
//     status: null,
//     dateRange: null,
//   });
//   const { userLocation } = useAuth();
//   const [hubOptions, setHubOptions] = useState({});

//   const FetchAllServiceRequests = async () => {
//     setIsLoading(true);
//     try {
//       const Requests = await GetAllServiceRequests(userLocation);
//       setAllServiceRequests(Requests);
//     } catch (err) {
//       toast.error("Unknown Error Occured");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const FetchRequestTypes = async () => {
//     try {
//       const RequestTypes = await GetAllRequestTypes();
//       setRequestTypes(RequestTypes);
//     } catch (err) {
//       toast.error("Unknown Error Occured");
//     }
//   };
//   const getDateParts = (date) => {
//     return {
//       year: date.getFullYear(),
//       month: date.getMonth(),
//       day: date.getDate(),
//     };
//   };
//   useEffect(() => {
//     FetchRequestTypes();
//     FetchAllServiceRequests();
//   }, [userLocation]);

//   // Filters Implementation
//   useEffect(() => {
//     let filteredArray = AllServiceRequests.filter((ticket) => {
//       if (Filters.type && ticket.type !== Filters.type) {
//         return false;
//       }
//       if (Filters.status && ticket.status !== Filters.status) {
//         return false;
//       }
//       if (Filters.hub && ticket.hub !== Filters.hub) {
//         return false;
//       }
//       if (Filters.dateRange && Filters.dateRange[0] && Filters.dateRange[1]) {
//         const ticketDateStr = ticket.date.substring(0, 10);

//         const startDate = new Date(Filters.dateRange[0]);
//         const endDate = new Date(Filters.dateRange[1]);

//         const startDateStr = startDate.toLocaleDateString("en-CA");
//         const endDateStr = endDate.toLocaleDateString("en-CA");

//         // console.log("Raw Ticket Date String:", ticketDateStr);
//         // console.log("Local Start Date String:", startDateStr);
//         // console.log("Local End Date String:", endDateStr);

//         if (ticketDateStr < startDateStr || ticketDateStr > endDateStr) {
//           return false;
//         }
//       }
//       if (searchFilter === "") {
//         return true;
//       }
//       return ticket.vehicleID
//         .toLowerCase()
//         .includes(searchFilter.toLowerCase());
//     });
//     setFilteredData(filteredArray);
//   }, [searchFilter, AllServiceRequests, Filters]);

//   useEffect(() => {
//     const fetchHubList = async () => {
//       try {
//         const { data } = await getHubList();

//         const result = data.reduce((acc, { location, hub_name }) => {
//           acc[location] = acc[location] || [];
//           acc[location].push({ label: hub_name, value: hub_name }); // ✅ Store as { label, value }
//           return acc;
//         }, {});

//         console.log("Hub Data:", result);
//         setHubOptions(result); // ✅ Store processed data in state
//       } catch (error) {
//         console.error("Error fetching hub list:", error);
//       }
//     };

//     fetchHubList();
//   }, []);

//   // Table Styling
//   const TableTheme = {
//     root: {
//       base: "w-full text-center text-sm font-semibold text-black shadow-none border-none bg-white",
//       shadow: "",
//       wrapper: "relative",
//     },
//     body: {
//       base: "",
//       cell: {
//         base: "px-6 py-4 ",
//       },
//     },
//     head: {
//       base: "text-xs uppercase",
//       cell: {
//         base: "px-6 py-3",
//       },
//     },
//   };
//   const { userRole } = useAuth();
//   return (
//     <>
//       {["Manager", "Admin"].includes(userRole) && (
//         <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
//           {/* Request Stats */}
//           <RequestStats />
//         </section>
//       )}

//       {/* All Service Requests */}
//       <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
//         {/* Header */}
//         <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
//           <div className="flex items-center gap-3">
//             {/* Request Status Filter */}
//             <Select
//               defaultValue={"All"}
//               style={{ width: 130 }}
//               onChange={(value) =>
//                 setFilters((prev) => ({ ...prev, status: value }))
//               }
//               options={[
//                 { value: null, label: "All" },
//                 { value: "In Progress", label: "In Progress" },
//                 { value: "To Do", label: "To Do" },
//                 { value: "Done", label: "Done" },
//               ]}
//             />
//             {/* Request Date Filter */}
//             <RangePicker
//               onChange={(dates) => {
//                 if (dates) {
//                   const utcDates = dates.map((date) => date.toISOString());
//                   // console.log("Selected Date Range (UTC):", utcDates);
//                   setFilters((prev) => ({ ...prev, dateRange: utcDates }));
//                 } else {
//                   // console.log("Date Range Cleared");
//                   setFilters((prev) => ({ ...prev, dateRange: null }));
//                 }
//               }}
//               allowClear={true}
//             />
//             {/* RequestType Filter */}
//             <Select
//               defaultValue={null}
//               style={{ width: 180 }}
//               onChange={(value) =>
//                 setFilters((prev) => ({ ...prev, type: value }))
//               }
//               options={[
//                 { value: null, label: "All Requests" },
//                 ...RequestTypes.map((type) => ({
//                   value: type.name,
//                   label: type.name,
//                 })),
//               ]}
//             />
//             {/* Add Hub Filter */}
//             <Select
//               defaultValue={null}
//               style={{ width: 180 }}
//               onChange={(value) =>
//                 setFilters((prev) => ({ ...prev, hub: value }))
//               }
//               options={[
//                 { value: null, label: "All Hubs" },
//                 ...(hubOptions[userLocation] || []),
//               ]}
//             />
//           </div>
//           <div className="flex items-center border border-slate-400 focus:ring-gray-500 px-2 py-0 rounded-lg w-max">
//             <Search color="grey" className="h-5 w-5" />
//             <input
//               type="text"
//               placeholder="Search Vehicle"
//               className="px-2 border-none  focus:ring-0 w-max py-1 outline-none"
//               onChange={(e) => setSearchFilter(e.target.value)}
//             />
//           </div>
//         </header>
//         {/* Table Section */}
//         <Table theme={TableTheme}>
//           <TableHead className="text-[#363636]">
//             <TableHeadCell className="p-1 text-left">#</TableHeadCell>
//             <TableHeadCell>Ticket Number</TableHeadCell>
//             <TableHeadCell className="text-center">
//               Vehicle Number
//             </TableHeadCell>
//             <TableHeadCell className="p-4 py-5 text-center">Type</TableHeadCell>
//             <TableHeadCell className="p-4 py-5 text-center">
//               Subscriber
//             </TableHeadCell>
//             <TableHeadCell className="p-4 py-5 text-center">
//               Status
//             </TableHeadCell>
//             <TableHeadCell className="p-4 py-5 text-center">
//               Technician
//             </TableHeadCell>
//           </TableHead>
//           <TableBody className="divide-y text-[#444A6D] font-normal">
//             {filteredData.length > 0 &&
//               filteredData
//                 .slice(page * pageLimit - pageLimit, page * pageLimit)
//                 .map((ticket, index) => {
//                   return (
//                     <TableRow
//                       key={ticket.ticketId}
//                       className="bg-white cursor-pointer hover:bg-slate-100"
//                       onClick={() =>
//                         navigate(`/service/requests/${ticket.ticketId}`)
//                       }
//                     >
//                       <TableCell className=" p-1 text-left text-gray-900">
//                         {index + 1 + (page - 1) * pageLimit}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap font-medium text-gray-900">
//                         {ticket.ticketId}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {ticket.vehicleID}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {ticket.type}
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {ticket.customerName}
//                       </TableCell>
//                       <TableCell className="text-center text-nowrap">
//                         <span
//                           className={`border px-3 py-1 ${
//                             StatusBadgeVariants[ticket.status]
//                           }`}
//                         >
//                           {ticket.status}
//                         </span>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {ticket.technician}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//           </TableBody>
//         </Table>
//         {/* Loader and NoData Display */}
//         {filteredData.length == 0 && (
//           <Loader
//             isLoading={isLoading}
//             Title="No Data Found"
//             height={300}
//             width={300}
//           />
//         )}
//         <footer className="flex justify-center">
//           {filteredData && (
//             <ConfigProvider
//               theme={{
//                 components: {
//                   Pagination: {
//                     // itemActiveBg: "#FF5733",
//                     itemActiveColor: "#ffff",
//                     itemActiveBorderColor: "green",
//                   },
//                 },
//               }}
//             >
//               <Pagination
//                 size="xl"
//                 onChange={(page, pageSize) => setPage(page)}
//                 defaultPageSize={pageLimit}
//                 defaultCurrent={1}
//                 showSizeChanger={false}
//                 total={filteredData.length}
//                 hideOnSinglePage
//               />
//             </ConfigProvider>
//           )}
//         </footer>
//       </section>
//     </>
//   );
// };

// export default ServiceRequests;




import React, { useEffect, useState } from "react";
import {
  GetAllRequestTypes,
  GetAllServiceRequests,
} from "../../service/servicerequest.service";
import toast from "react-hot-toast";
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
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import Loader from "../../components/Loader";
import { Search } from "lucide-react";
import RequestStats from "../../components/service/RequestStats";
import StatusBadgeVariants from "../../utils/StatusBadgeVariants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { getHubList } from "../../service/location.service";

const ServiceRequests = () => {
  const [AllServiceRequests, setAllServiceRequests] = useState([]);
  const [RequestTypes, setRequestTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const pageLimit = 40;
  const [Filters, setFilters] = useState({
    type: null,
    status: null,
    dateRange: null,
  });
  const { userLocation } = useAuth();
  const [hubOptions, setHubOptions] = useState({});

  const FetchAllServiceRequests = async () => {
    setIsLoading(true);
    try {
      const Requests = await GetAllServiceRequests(userLocation);
      setAllServiceRequests(Requests);
    } catch (err) {
      toast.error("Unknown Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  const FetchRequestTypes = async () => {
    try {
      const RequestTypes = await GetAllRequestTypes();
      setRequestTypes(RequestTypes);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  const getDateParts = (date) => {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  };
  useEffect(() => {
    FetchRequestTypes();
    FetchAllServiceRequests();
  }, [userLocation]);

  // Filters Implementation
  useEffect(() => {
    let filteredArray = AllServiceRequests.filter((ticket) => {
      if (Filters.type && ticket.type !== Filters.type) {
        return false;
      }
      if (Filters.status && ticket.status !== Filters.status) {
        return false;
      }
      if (Filters.hub && ticket.hub !== Filters.hub) {
        return false;
      }
      if (Filters.dateRange && Filters.dateRange[0] && Filters.dateRange[1]) {
        const ticketDateStr = ticket.date.substring(0, 10);

        const startDate = new Date(Filters.dateRange[0]);
        const endDate = new Date(Filters.dateRange[1]);

        const startDateStr = startDate.toLocaleDateString("en-CA");
        const endDateStr = endDate.toLocaleDateString("en-CA");

        // console.log("Raw Ticket Date String:", ticketDateStr);
        // console.log("Local Start Date String:", startDateStr);
        // console.log("Local End Date String:", endDateStr);

        if (ticketDateStr < startDateStr || ticketDateStr > endDateStr) {
          return false;
        }
      }
      if (searchFilter === "") {
        return true;
      }
      return ticket.vehicleID
        .toLowerCase()
        .includes(searchFilter.toLowerCase());
    });
    setFilteredData(filteredArray);
  }, [searchFilter, AllServiceRequests, Filters]);

  useEffect(() => {
    const fetchHubList = async () => {
      
      try {
        const { data } = await getHubList();

        const result = data.reduce((acc, { location, hub_name }) => {
          acc[location] = acc[location] || [];
          acc[location].push({ label: hub_name, value: hub_name }); // ✅ Store as { label, value }
          return acc;
        }, {});

        console.log("Hub Data:", result);
        setHubOptions(result); // ✅ Store processed data in state
      } catch (error) {
        console.error("Error fetching hub list:", error);
      }
    };

    fetchHubList();
  }, []);

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
  const { userRole } = useAuth();
  return (
    <>
      {["Manager", "Admin","MIS"].includes(userRole) && (
        <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
          {/* Request Stats */}
          <RequestStats />
        </section>
      )}

      {/* All Service Requests */}
      <section className="flex flex-col gap-5 bg-white m-4 p-3 rounded-lg order-1 md:order-last overflow-auto">
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
                if (dates) {
                  const utcDates = dates.map((date) => date.toISOString());
                  // console.log("Selected Date Range (UTC):", utcDates);
                  setFilters((prev) => ({ ...prev, dateRange: utcDates }));
                } else {
                  // console.log("Date Range Cleared");
                  setFilters((prev) => ({ ...prev, dateRange: null }));
                }
              }}
              allowClear={true}
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
            {/* Add Hub Filter */}
          {["Manager", "Admin"].includes(userRole) && (
  <Select
    defaultValue={null}
    style={{ width: 180 }}
    onChange={(value) =>
      setFilters((prev) => ({ ...prev, hub: value }))
    }
    options={[
      { value: null, label: "All Hubs" },
      ...(hubOptions[userLocation] || []),
    ]}
  />
)}
          </div>
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
            <TableHeadCell className="p-4 py-5 text-center">
              Technician
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
                      <TableCell className="text-center">
                        {ticket.technician}
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

export default ServiceRequests;






