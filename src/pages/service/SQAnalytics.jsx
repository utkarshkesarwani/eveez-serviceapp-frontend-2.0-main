import React from "react";
import { Select } from "antd";
import RequestTypeStats from "../../components/service/RequestTypeStats";
import IssueTypeStats from "../../components/service/IssueTypeStats";
import CustomerRating from "../../components/service/CustomerRating";
const SQAnalytics = () => {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <RequestTypeStats />
        <IssueTypeStats />
      </section>
      {/* <section>
        <CustomerRating />
      </section> */}
    </>
  );
};

export default SQAnalytics;
