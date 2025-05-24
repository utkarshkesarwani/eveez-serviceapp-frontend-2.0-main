import { Tabs } from "flowbite-react";
import PartRequest from "./PartRequest";
import ServiceRequestApproval from "./ServiceRequestApproval";

const RequestApproval = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Tabs aria-label="Tabs with underline" variant="underline">
        <Tabs.Item active title="Service">
          <ServiceRequestApproval />
        </Tabs.Item>
        <Tabs.Item title="Parts">
          <PartRequest />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default RequestApproval;
