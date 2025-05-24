// /* eslint-disable no-unused-vars */
// import { Avatar } from "flowbite-react";
// import { Bell, LogOut, Menu, User } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Dropdown, MegaMenu } from "flowbite-react";
// import { Button, Drawer } from "flowbite-react";
// import Sidebar from "./sidebar/sidebar";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../hooks/AuthProvider";
// import { Select } from "antd";
// import { Modal } from "flowbite-react";
// import NewRequestForm from "./newRequest/NewRequestForm";
// import { DrawerTheme, ModalTheme } from "../utils/themes";
// import { getLocation } from "../service/location.service";
// // import Extract from "./Extract";
// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const handleClose = () => setIsOpen(false);
//   const user = JSON.parse(localStorage.getItem("user"));
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };
//   const { userRole, userLocation, setUserLocation } = useAuth();
//   const [openModal, setOpenModal] = useState(false);
//   const [locationOption, setLocationOption] = useState([]);

//   const getCity = async () => {
//     try {
//       const res = await getLocation();
//       const optionData = res.data.map((city) => ({
//         value: city.name,
//         label: city.name,
//       }));
//       setLocationOption(optionData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getCity();
//   }, []);

//   return (
//     <header className="bg-white w-full flex items-center justify-between py-3 px-4">
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="flex md:hidden items-center justify-center"
//         >
//           <Menu className="h-7 w-7" />
//         </button>
//         <span className="hidden sm:block text-normal sm:text-2xl font-semibold">
//           Service App
//         </span>
//         {/* <Link to="/dashboard" className=" md:p-2">
//           <img src="/header/logo_full.png" alt="EVeez Logo" className="w-24" />
//         </Link> */}
//       </div>
//       <section className="flex gap-4 items-center ">
//         {userRole === "Admin" && (
//           <Select
//             defaultValue="NCR"
//             style={{ width: 120 }}
//             onChange={(value) => setUserLocation(value)}
//             options={locationOption}
//           />
//         )}
//         {/* {
//           userRole === "Manager" && (
//             <Extract/>
//           )
//         } */}
//         {["Manager", "Technician", "Admin"].includes(userRole) && (
//           <button
//             onClick={() => setOpenModal(true)}
//             className=" text-sm sm:text-lg px-3 py-1 border border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md mr-3"
//           >
//             Add New
//           </button>
//         )}

//         {user && (
//           <Dropdown
//             label={<User className="h-4 w-4" color="black" />}
//             arrowIcon={false}
//             className="focus:ring-0"
//             style={{
//               backgroundColor: "white",
//               border: "1px solid black",
//               borderRadius: "9999px",
//               borderWidth: "1px",
//               borderColor: "black",
//               padding: "0px",
//               width: "35px",
//             }}
//           >
//             <Dropdown.Item className="flex flex-col justify-center">
//               <span className="block text-sm">{user.name}</span>
//               <span className="block truncate text-sm font-medium">
//                 {user.role}
//               </span>
//             </Dropdown.Item>
//           </Dropdown>
//         )}

//         {/* <button className="p-2 rounded-full border border-black">
//           <Bell className="h-4 w-4" />
//         </button> */}
//         <button
//           onClick={handleLogout}
//           className="p-2 rounded-full border border-black"
//         >
//           <LogOut className="h-4 w-4" />
//         </button>
//       </section>
//       <Drawer
//         open={isOpen}
//         theme={DrawerTheme}
//         onClose={handleClose}
//         className="w-max pr-5"
//       >
//         <Drawer.Items>
//           <Sidebar />
//         </Drawer.Items>
//       </Drawer>

//       <Modal
//         show={openModal}
//         theme={ModalTheme}
//         onClose={() => {
//           setOpenModal(false);
//           window.location.reload();
//         }}
//       >
//         <Modal.Header className="py-3">Add New Service Request</Modal.Header>
//         <Modal.Body>
//           <NewRequestForm />
//         </Modal.Body>
//       </Modal>
//     </header>
//   );
// };

// export default Navbar;



/* eslint-disable no-unused-vars */
import { Avatar } from "flowbite-react";
import { Bell, LogOut, Menu, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dropdown, MegaMenu } from "flowbite-react";
import { Button, Drawer } from "flowbite-react";
import Sidebar from "./sidebar/sidebar";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { Select } from "antd";
import { Modal } from "flowbite-react";
import NewRequestForm from "./newRequest/NewRequestForm";
import { DrawerTheme, ModalTheme } from "../utils/themes";
import { getLocation, getHubList } from "../service/location.service";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const { userRole, userLocation, setUserLocation } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [locationOption, setLocationOption] = useState([]);
  const [hubOptions, setHubOptions] = useState([]);

  const getCity = async () => {
    try {
      const res = await getLocation();
      const optionData = res.data.map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setLocationOption(optionData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHubList = async () => {
    try {
      const { data } = await getHubList();
      const optionData = data.map((hub) => ({
        value: hub.hub_name,
        label: hub.hub_name,
      }));
      setHubOptions(optionData);
    } catch (error) {
      console.error("Error fetching hub list:", error);
    }
  };

  useEffect(() => {
    getCity();
    if (userRole === "MIS") {
      fetchHubList();
    }
  }, [userRole]);

  return (
    <header className="bg-white w-full flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center"
        >
          <Menu className="h-7 w-7" />
        </button>
        <span className="hidden sm:block text-normal sm:text-2xl font-semibold">
          Service App
        </span>
      </div>
      <section className="flex gap-4 items-center ">
        {userRole === "Admin" && (
          <Select
            defaultValue="NCR"
            style={{ width: 120 }}
            onChange={(value) => setUserLocation(value)}
            options={locationOption}
          />
        )}
        {userRole === "MIS" && (
          <Select
            defaultValue="All Hubs"
            style={{ width: 120 }}
            onChange={(value) => setUserLocation(value)}
            options={[
              { value: null, label: "All Hubs" },
              ...hubOptions,
            ]}
          />
        )}
        {["Manager", "Technician", "Admin"].includes(userRole) && (
          <button
            onClick={() => setOpenModal(true)}
            className=" text-sm sm:text-lg px-3 py-1 border border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md mr-3"
          >
            Add New
          </button>
        )}

        {user && (
          <Dropdown
            label={<User className="h-4 w-4" color="black" />}
            arrowIcon={false}
            className="focus:ring-0"
            style={{
              backgroundColor: "white",
              border: "1px solid black",
              borderRadius: "9999px",
              borderWidth: "1px",
              borderColor: "black",
              padding: "0px",
              width: "35px",
            }}
          >
            <Dropdown.Item className="flex flex-col justify-center">
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.role}
              </span>
            </Dropdown.Item>
          </Dropdown>
        )}

        <button
          onClick={handleLogout}
          className="p-2 rounded-full border border-black"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </section>
      <Drawer
        open={isOpen}
        theme={DrawerTheme}
        onClose={handleClose}
        className="w-max pr-5"
      >
        <Drawer.Items>
          <Sidebar />
        </Drawer.Items>
      </Drawer>

      <Modal
        show={openModal}
        theme={ModalTheme}
        onClose={() => {
          setOpenModal(false);
          window.location.reload();
        }}
      >
        <Modal.Header className="py-3">Add New Service Request</Modal.Header>
        <Modal.Body>
          <NewRequestForm />
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Navbar;