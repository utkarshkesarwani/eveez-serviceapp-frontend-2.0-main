import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axiosInstance from "../../service/api";

const PartRequest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  const buttonStyle = {
    width: "80px",
    backgroundColor: "white",
    borderColor: "#d64820",
    color: "#d64820",
    marginRight: 10,
    marginBottom: 5,
  };

  const hoverStyle = {
    ":hover": {
      backgroundColor: "#fff1f0",
      borderColor: "#d64820",
      color: "#d64820",
    },
  };

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticket_id",
      key: "ticket_id",
      align: "center",
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicle",
      key: "vehicle",
      align: "center",
    },
    {
      title: "Technician",
      dataIndex: "technician",
      key: "technician",
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      align: "center",
      render: (text, record) => (
        <>
          {record.requested_parts.map((part, index) => (
            <div key={index}>
              {part.product_name}
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Count",
      key: "count",
      align: "center",
      render: (text, record) => (
        <>
          {record.requested_parts.map((part, index) => (
            <div key={index}>{part.count}</div>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            style={{ ...buttonStyle, ...hoverStyle }}
            onClick={() => handleApproval(record.ticket_id, "approve")}
          >
            Approve
          </Button>
          <Button
            style={{ ...buttonStyle, ...hoverStyle }}
            onClick={() => handleApproval(record.ticket_id, "reject")}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchUnapprovedParts();
  }, []);

  const fetchUnapprovedParts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/unapprovedparts", {
        key: "HSw@4cqd$%DFs2@",
        token: localStorage.getItem("token"),
      });
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching unapproved parts:", error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (ticketId, action) => {
    setLoading(true);
    const payload = {
      key: "HSw@4cqd$%DFs2@",
      token: localStorage.getItem("token"),
      ticket_id: ticketId,
      [action === "approve" ? "Approved" : "Rejected"]: 1,
    };

    try {
      await axiosInstance.post("/approvedrejectedparts", payload);
      message.success(
        `Successfully ${
          action === "approve" ? "approved" : "rejected"
        } the request.`
      );
      fetchUnapprovedParts();
    } catch (error) {
      console.error(
        `Error ${action === "approve" ? "approving" : "rejecting"} part:`,
        error
      );
      message.error(
        `Failed to ${action === "approve" ? "approve" : "reject"} the request.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => setPageSize(size),
        }}
        loading={loading}
        bordered={false}
        style={{ backgroundColor: "#fff" }}
        rowClassName="table-row"
        rowKey="ticket_id"
        scroll={{ x: true }}
      />
    </div>
  );
};

export default PartRequest;
