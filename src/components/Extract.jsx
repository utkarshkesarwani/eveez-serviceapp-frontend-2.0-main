import { Button, DatePicker, Modal } from "antd";
import { useState } from "react";
import { CSVDownload, CSVLink } from "react-csv";
import toast from "react-hot-toast";
import { GetDownlodableServiceData } from "../service/servicerequest.service";

const Extract = () => {
  const [openModal, setOpenModal] = useState(false);
  const { RangePicker } = DatePicker;
  const [modalData, setModalData] = useState({
    startDate: null,
    endDate: null,
    openTicket: true,
    closeTicket: true,
  });
  const [serviceData, setServiceData] = useState([]);

  const headers = [
    { label: "Ticket ID", key: "ticket_id" },
    { label: "Vehicle", key: "vehicle" },
    { label: "Location", key: "location" },
    { label: "Customer Name", key: "customer_name" },
    { label: "Mobile No", key: "customer_mobile" },
    { label: "Email", key: "customer_email" },
    { label: "Date", key: "date" },
    { label: "Closure Date", key: "closure_date" },
    { label: "Requested Parts", key: "requested_parts" },
    { label: "Spare Parts", key: "spare_parts" },
  ];

  const handleCancel = () => setOpenModal(false);

  const handleOk = async () => {
    try {
      if (!modalData.startDate || !modalData.endDate) {
        toast.error("Date range is required");
        return;
      }
      const result = await GetDownlodableServiceData(modalData);
      console.log(result.data);
      setServiceData(result.data);
      // toast.success("Data fetched successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Extract</Button>

      <Modal
        open={openModal}
        title="Extract Service Data"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Button
          onClick={() =>
            setModalData((prev) => ({
              ...prev,
              closeTicket: !prev.closeTicket,
            }))
          }
        >
          {modalData.closeTicket
            ? "Exclude Closed Tickets"
            : "Include Closed Tickets"}
        </Button>
        <Button
          onClick={() =>
            setModalData((prev) => ({ ...prev, openTicket: !prev.openTicket }))
          }
        >
          {modalData.openTicket
            ? "Exclude Open Tickets"
            : "Include Open Tickets"}
        </Button>

        <RangePicker
          onChange={(value) => {
            setModalData((prev) => ({
              ...prev,
              startDate: value[0].format("YYYY-MM-DD"),
              endDate: value[1].format("YYYY-MM-DD"),
            }));
          }}
        />
        {serviceData.length > 0 && (
          <CSVDownload
            data={serviceData}
            headers={headers}
            filename="service_data.csv"
            target="_blank"
          />
           
        )}
         {/* <Button>Download CSV</Button>
          </CSVLink> */}
      </Modal>
    </>
  );
};

export default Extract;
