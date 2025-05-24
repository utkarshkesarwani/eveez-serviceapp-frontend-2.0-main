// import { Layers, House, Landmark, Settings, Plus} from "lucide-react";

// const paths = [
//   {
//     title: "Home",
//     path: "/home",
//     icon: House,
//     hasSubmenu: true,
//     allowedRoles: ["Manager", "Admin"],
//     submenu: [
//       {
//         title: "Overview",
//         path: "/home/overview",
//         allowedRoles: ["Manager", "Admin"],
//         hasSubmenu: false,
//       },
//       {
//         title: "Technician Efficiency",
//         path: "/home/technician",
//         allowedRoles: ["Manager", "Admin"],
//         hasSubmenu: false,
//       },
//     ],
//   },
//   {
//     title: "Service Request",
//     path: "/service",
//     allowedRoles: ["Manager", "Admin", "Technician"],
//     icon: Layers,
//     hasSubmenu: true,
//     submenu: [
//       {
//         title: "Service Requests",
//         path: "/service/requests",
//         allowedRoles: ["Manager", "Admin", "Technician"],
//         hasSubmenu: false,
//       },
//       {
//         title: "Service Quality Analytics",
//         path: "/service/quality-analytics",
//         allowedRoles: ["Manager", "Admin"],
//         hasSubmenu: false,
//       },
//       {
//         title: "Requests",
//         path: "/service/RequestApproval",
//         allowedRoles: ["Manager"],
//         hasSubmenu: false,
//       },
//     ],
//   },
//   {
//     title: "Technician Records",
//     path: "/technician-records",
//     allowedRoles: ["Manager", "Admin", "Technician"],
//     icon: Landmark,
//     hasSubmenu: false,
//   },
//   {
//     title: "Assign",
//     path: "/assign",
//     allowedRoles: ["Manager"],
//     icon: Settings,
//     hasSubmenu: false,
//   },
//   {
//     title: "Add User",
//     path: "/add-user",
//     allowedRoles: ["Manager", "Admin"],
//     icon: Plus,
//     hasSubmenu: true,
//     submenu: [
//       {
//         title: "Add User",
//         path: "/add-user",
//         allowedRoles: ["Manager", "Admin"],
//         hasSubmenu: false,
//       },
//       {
//         title: "Update User",
//         path: "/update-user",
//         allowedRoles: ["Manager", "Admin"],
//         hasSubmenu: false,
//       },
//       {
//         title: "Delete User",
//         path: "delete-user",
//         allowedRoles: ["Manager", "Admin"],
//         hasSubmenu: false,
//       },
//     ],
//   },
// ];

// export default paths;


import { Layers, House, Landmark, Settings, Plus, ClipboardList } from "lucide-react";

const paths = [
  {
    title: "Home",
    path: "/home",
    icon: House,
    hasSubmenu: true,
    allowedRoles: ["Manager", "Admin"],
    submenu: [
      {
        title: "Overview",
        path: "/home/overview",
        allowedRoles: ["Manager", "Admin"],
        hasSubmenu: false,
      },
      {
        title: "Technician Efficiency",
        path: "/home/technician",
        allowedRoles: ["Manager", "Admin"],
        hasSubmenu: false,
      },
    ],
  },
  {
    title: "Service Request",
    path: "/service",
    allowedRoles: ["Manager", "Admin", "Technician", "MIS"],
    icon: Layers,
    hasSubmenu: true,
    submenu: [
      {
        title: "Service Requests",
        path: "/service/requests",
        allowedRoles: ["Manager", "Admin", "Technician", "MIS"],
        hasSubmenu: false,
      },
      {
        title: "Service Quality Analytics",
        path: "/service/quality-analytics",
        allowedRoles: ["Manager", "Admin"],
        hasSubmenu: false,
      },
      {
        title: "Requests",
        path: "/service/RequestApproval",
        allowedRoles: ["Manager"],
        hasSubmenu: false,
      },
    ],
  },
  {
    title: "Technician Records",
    path: "/technician-records",
    allowedRoles: ["Manager", "Admin", "Technician"],
    icon: Landmark,
    hasSubmenu: false,
  },
  {
    title: "Assign",
    path: "/assign",
    allowedRoles: ["Manager"],
    icon: Settings,
    hasSubmenu: false,
  },
  {
    title: "Add User",
    path: "/add-user",
    allowedRoles: ["Manager", "Admin"],
    icon: Plus,
    hasSubmenu: true,
    submenu: [
      {
        title: "Add User",
        path: "/add-user",
        allowedRoles: ["Manager", "Admin"],
        hasSubmenu: false,
      },
      {
        title: "Update User",
        path: "/update-user",
        allowedRoles: ["Manager", "Admin"],
        hasSubmenu: false,
      },
      {
        title: "Delete User",
        path: "delete-user",
        allowedRoles: ["Manager", "Admin"],
        hasSubmenu: false,
      },
    ],
  },
 
];

export default paths;