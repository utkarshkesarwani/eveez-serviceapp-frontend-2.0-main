import React from "react";
import Loader from "../Loader";

const Result = ({ isLoading, response }) => {
  return (
    <section>
      {response.code === 0 ? (
        <div className="text-base text-red-500 text-center">
          {response?.message?.map((message) => (
            <span>{response.message}</span>
          ))}
        </div>
      ) : (
        <div className="text-base text-green-500 text-center">
          <span>{response.message}</span>
        </div>
      )}
    </section>
  );
};

export default Result;
