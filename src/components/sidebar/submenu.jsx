import React, { useState, useEffect } from "react";
import { ChevronDownCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Timeline } from "flowbite-react";
import { useAuth } from "../../hooks/AuthProvider";

const MenuItemWithSub = ({ data }) => {
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  // Check if the current path matches any submenu item
  const isActive = data.submenu.some((subItem) =>
    pathname.includes(subItem.path)
  );

  useEffect(() => {
    // Open submenu if any item is active
    if (isActive) setSubmenuOpen(true);
  }, [isActive]);

  const Icon = data.icon;

  return (
    <div>
      <button
        className="flex items-center"
        onClick={() => setSubmenuOpen(!isSubmenuOpen)}
      >
        <div
          className={`flex gap-3 items-center text-sm font-[500] tracking-wide text-[#6C6C74] rounded-lg px-2 py-2 w-[200px] ${
            isActive ? "bg-[#FFEEEB]" : ""
          }`}
        >
          <Icon
            className={`h-5 w-5`}
            color={isActive ? "#FF5733" : "#6C6C74"}
          />
          <span className={`${isActive ? "text-[#FF5733]" : "text-[#6C6C74]"}`}>
            {data.title}
          </span>
          <ChevronDownCircle
            className={`h-4 w-4 mb-0.5 ${isSubmenuOpen ? "rotate-180" : ""}`}
            color={isActive ? "#FF5733" : "#6C6C74"}
          />
        </div>
      </button>
      {isSubmenuOpen && (
        <div>
          <Submenu items={data.submenu} />
        </div>
      )}
    </div>
  );
};

const Submenu = ({ items }) => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();

  const Theme = {
    root: {
      direction: {
        horizontal: "sm:flex",
        vertical: "relative border-l border-gray-200 ",
      },
    },
    item: {
      root: {
        horizontal: "relative mb-6 sm:mb-0",
        vertical: "mb-6 ml-6",
      },
      content: {
        root: {
          base: "",
          horizontal: "mt-3 sm:pr-8",
          vertical: "",
        },
        body: {
          base: "mb-4 text-base font-normal text-gray-500",
        },
        time: {
          base: "mb-1 text-sm font-normal leading-none text-gray-400",
        },
        title: {
          base: "text-lg font-semibold text-gray-900 ",
        },
      },
      point: {
        horizontal: "flex items-center",
        line: "hidden h-0.5 w-full bg-gray-200 currentitem:bg-[#ff5733] sm:flex",
        marker: {
          base: {
            horizontal:
              "absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 currentitem:border-[#ff5733] currentitem:bg-[#ff5733]",
            vertical:
              "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 currentitem:border-[#ff5733] currentitem:bg-[#ff5733]",
          },
          icon: {
            base: "h-3 w-3 text-cyan-600 currentitem:text-cyan-300",
            wrapper:
              "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-200 ring-8 ring-white currentitem:bg-cyan-900 currentitem:ring-gray-900",
          },
        },
      },
    },
  };

  return (
    <Timeline theme={Theme} className="ml-12 py-3">
      {items.map((item, index) => {
        const isCurrentPath = pathname.includes(item.path);
        const isLastItem = index === items.length - 1;
        if (item.allowedRoles.includes(userRole)) {
          return (
            <Timeline.Item key={index} className={isLastItem ? "mb-0" : ""}>
              <Timeline.Point
                className={`${
                  isCurrentPath
                    ? "bg-[#FF5733] !important border-[#FF5733] !important currentitem"
                    : "bg-gray-200 border-gray-200"
                }`}
              />
              <Timeline.Content>
                <Timeline.Time>
                  <Link
                    to={item.path}
                    className={
                      isCurrentPath ? "text-[#FF5733]" : "text-gray-500"
                    }
                  >
                    {item.title}
                  </Link>
                </Timeline.Time>
              </Timeline.Content>
            </Timeline.Item>
          );
        }
      })}
    </Timeline>
  );
};

export default MenuItemWithSub;
