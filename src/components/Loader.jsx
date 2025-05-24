import React from "react";
import NoResult from "../assets/NoData.svg";
import { Spinner } from "flowbite-react";
const Loader = ({ Title, isLoading, height, width }) => {
  const SpinnerTheme = {
    base: "inline animate-spin text-gray-200",
    color: {
      failure: "fill-red-600",
      gray: "fill-gray-600",
      info: "fill-cyan-600",
      pink: "fill-pink-600",
      purple: "fill-purple-600",
      success: "fill-green-500",
      warning: "fill-orange-400",
    },
    light: {
      off: {
        base: "",
        color: {
          failure: "",
          gray: "",
          info: "",
          pink: "",
          purple: "",
          success: "",
          warning: "",
        },
      },
      on: {
        base: "",
        color: {
          failure: "",
          gray: "",
          info: "",
          pink: "",
          purple: "",
          success: "",
          warning: "",
        },
      },
    },
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    },
  };
  return (
    <section className="h-full w-full">
      {isLoading ? (
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
          <Spinner size="lg" color="warning" theme={SpinnerTheme} />
          <span className="text-2xl">Loading...</span>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <img src={NoResult} alt="No Data" width={width} height={height} />
          <p className="text-center mb-10">{Title}</p>
        </div>
      )}
    </section>
  );
};

export default Loader;
