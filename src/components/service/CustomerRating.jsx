import React from "react";
import CustomerRatingGraph from "../graphs/CustomerRatingGraph";

const CustomerRating = () => {
  return (
    <section className="flex flex-col gap-5 bg-white m-4 my-2 p-3 rounded-lg order-1 md:order-last overflow-auto">
      <header className="flex flex-col sm:flex-row gap-3 md:items-center justify-between">
        <span className="flex items-center gap-3 text-lg sm:text-xl font-semibold">
          Customer Satisfaction Rating
        </span>
      </header>
      <section>
        <CustomerRatingGraph
          data={[
            [
              "User 1",
              "User 2",
              "User 3",
              "User 4",
              "User 4",
              "User 5",
              "User 6",
            ],
            [1, 2, 2, 3, 4, 5, 3, 1],
          ]}
        />
      </section>
    </section>
  );
};

export default CustomerRating;
