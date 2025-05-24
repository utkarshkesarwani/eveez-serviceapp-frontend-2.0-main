import React, { useEffect, useState } from "react";
import { ConfigProvider, Pagination, Select, DatePicker } from "antd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Loader from "../Loader";
import { GetAllRequestTypes } from "../../service/servicerequest.service";
import toast from "react-hot-toast";
import { GetWeeklyAnalysisData } from "../../service/efficiency.service";
import { useAuth } from "../../hooks/AuthProvider";
import dayjs from "dayjs";

const WeeklyAnalysis = () => {
  const [weeklyAnalysisData, setWeeklyAnalsisData] = useState([]);
  const [technicianList, setTechnicianList] = useState([]);
  const [totalWeeks, setTotalWeeks] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const pageLimit = 40;
  const [isLoading, setIsLoading] = useState(false);
  const [RequestTypes, setRequestTypes] = useState([]);
  const [RequestFilter, setRequestFilter] = useState("");
  const [timeRange, setTimeRange] = useState([
    dayjs().subtract(14, "day"),
    dayjs(),
  ]);
  const { RangePicker } = DatePicker;
  const { userLocation } = useAuth();

  // Fetching request types
  const FetchRequestTypes = async () => {
    try {
      const RequestTypes = await GetAllRequestTypes();
      setRequestTypes(RequestTypes);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  const FetchWeeklyAnalysisData = async () => {
    setIsLoading(true);
    try {
      const data = await GetWeeklyAnalysisData(
        new Date(timeRange[0]),
        new Date(timeRange[1]),
        userLocation,
        RequestFilter
      );

      // Use a Map to store formatted data for technicians
      let FormattedData = new Map();

      // Iterate over each week's data
      data.forEach((week, weekIndex) => {
        week.data.forEach((technician) => {
          if (FormattedData.has(technician.name)) {
            // If technician already exists, update their array by setting the value at the correct weekIndex
            let oldData = FormattedData.get(technician.name);
            oldData[weekIndex] = technician.count; // Replace the value at the correct index
            FormattedData.set(technician.name, oldData);
          } else {
            // Initialize the array with empty values up to the current weekIndex
            let newData = Array(weekIndex).fill(0); // Fill previous weeks with 0
            newData[weekIndex] = technician.count; // Set the current week data
            FormattedData.set(technician.name, newData);
          }
        });
      });

      setWeeklyAnalsisData(FormattedData);
      setTechnicianList(Array.from(FormattedData.keys()));
      setTotalWeeks(data.length);
    } catch (err) {
      console.log(err);
      toast.error("Unknown Error Occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate percentage change
  function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) {
      return newValue > 0 ? `NA` : `NA`;
    }
    const difference = newValue - oldValue;
    const percentageChange = (difference / oldValue) * 100;

    return percentageChange > 0 ? (
      <p className="text-green-500 font-medium">
        + {percentageChange.toFixed(2)} %
      </p>
    ) : (
      <p className="text-red-400 font-medium">
        {percentageChange.toFixed(2)} %
      </p>
    );
  }

  // Initialize request types on mount
  useEffect(() => {
    FetchRequestTypes();
  }, []);

  // Fetch weekly data whenever the time range, request filter, or location changes
  useEffect(() => {
    FetchWeeklyAnalysisData();
  }, [timeRange, RequestFilter, userLocation]);

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
    <section className="flex flex-col gap-3 bg-white m-4 p-1 rounded-lg order-1 md:order-last overflow-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <h1 className="text-xl md:text-2xl font-[600]">
          Weekly Analysis (Last 14 Days)
        </h1>
        <div className="flex items-center gap-3 px-2 py-0 rounded-lg w-max">
          {/* RequestType Filter */}
          <Select
            defaultValue={null}
            style={{ width: 180 }}
            onChange={(value) => setRequestFilter(value)}
            options={[
              { value: null, label: "All Requests" },
              ...RequestTypes.map((type) => ({
                value: type.name,
                label: type.name,
              })),
            ]}
          />
          <RangePicker
            defaultValue={[dayjs().subtract(14, "day"), dayjs()]}
            onChange={(value) => {
              if (value) {
                setTimeRange([
                  value[0].format("YYYY-MM-DD"),
                  value[1].format("YYYY-MM-DD"),
                ]);
              } else {
                setTimeRange([null, null]);
              }
            }}
          />
        </div>
      </header>

      {/* Table Section */}
      <Table theme={TableTheme}>
        <TableHead className="text-[#363636]">
          <TableHeadCell className="p-1 text-left">#</TableHeadCell>
          <TableHeadCell>Technician Name</TableHeadCell>
          {totalWeeks > 0 &&
            Array.from({ length: totalWeeks }, (_, index) => (
              <>
                <TableHeadCell className="p-4 py-5 text-center text-nowrap">
                  Week {index + 1}
                </TableHeadCell>
                <TableHeadCell className="p-4 py-5 text-center text-nowrap">
                  Avg/Day
                </TableHeadCell>
                {index !== 0 && (
                  <TableHeadCell className="p-4 py-5 text-center text-nowrap">
                    W-O-W
                  </TableHeadCell>
                )}
              </>
            ))}
        </TableHead>
        <TableBody className="divide-y text-[#444A6D] font-normal">
          {technicianList.length > 0 &&
            technicianList.map((technician, index) => {
              return (
                <TableRow key={index} className="bg-white">
                  <TableCell className=" p-1 text-left text-gray-900">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900">
                    {technician}
                  </TableCell>
                  {weeklyAnalysisData.has(technician) &&
                    weeklyAnalysisData
                      .get(technician)
                      .map((weekData, index) => (
                        <>
                          <TableCell className="p-4 py-5 text-center text-nowrap">
                            {weekData}
                          </TableCell>
                          <TableCell className="p-4 py-5 text-center text-nowrap">
                            {Math.floor(weekData / 7)}
                          </TableCell>
                          {index !== 0 && (
                            <TableCell className="p-4 py-5 text-center text-nowrap">
                              {calculatePercentageChange(
                                weeklyAnalysisData.get(technician)[index - 1],
                                weekData
                              )}
                            </TableCell>
                          )}
                        </>
                      ))}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </section>
  );
};

export default WeeklyAnalysis;
