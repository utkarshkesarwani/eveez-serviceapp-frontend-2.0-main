import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import {
  GetAllRequests,
  ChangeRequestStatus,
} from "../../service/requestApproval.service";
import { CalendarFormat } from "../../utils/TimeFormatter";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ServiceRequestApproval = () => {
  const [requests, setRequests] = useState([]);

  const getAllRequests = async (status) => {
    try {
      const data = await GetAllRequests(status);
      setRequests(data.data || []); // Set data to an empty array if no data
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch requests."); // Show error message
    }
  };

  useEffect(() => {
    getAllRequests("pending"); // Fetch pending requests on component mount
  }, []);

  const handleAction = async (record) => {
    try {
      const updateRes = await ChangeRequestStatus({
        status: "approved",
        ticketId: record.ticket_id,
      });
      toast.success(updateRes[0]?.message);
      getAllRequests("pending"); // Refresh te list
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticket_id",
      key: "ticket_id",
      render: (text) => <Link to={`/service/requests/${text}`}>{text}</Link>,
    },
    {
      title: "Technician",
      dataIndex: "technician",
      key: "technician",
    },
    {
      title: "Request Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => CalendarFormat(new Date(text)),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          className="bg-[#FF5733] hover:bg-[#FF5733]-500"
          type="primary"
          onClick={() => handleAction(record)}
        >
          Approve
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={requests}
        columns={columns}
        rowKey="_id" // Use a unique key for each row
        pagination={{ pageSize: 10 }}
        style={{ backgroundColor: "#fff" }}
        className="font-semibold"
      />
    </div>
  );
};

export default ServiceRequestApproval;
