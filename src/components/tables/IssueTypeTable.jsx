import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
const IssueTypeTable = ({ data }) => {
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
    <div>
      <Table theme={TableTheme}>
        <TableHead className="text-[#363636]">
          <TableHeadCell className="p-1 text-left">Issue</TableHeadCell>
          <TableHeadCell>Frequency</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y text-[#444A6D] font-normal">
          {data.length > 0 &&
            data.map((issue) => {
              return (
                <TableRow key={issue.name} className="bg-white">
                  <TableCell className=" p-1 text-left text-gray-900">
                    {issue.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900">
                    {issue.count}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default IssueTypeTable;
