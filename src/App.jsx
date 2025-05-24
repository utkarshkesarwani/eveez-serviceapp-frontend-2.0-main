// // App.jsx
// import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/login/Login";
// import UnAssignedTickets from "./pages/assign/UnAssignedTickets";
// import AssignTicket from "./pages/assign/AssignTicket";
// import RootLayout from "./components/layout/RootLayout";
// import ServiceRequests from "./pages/service/ServiceRequests";
// import SQAnalytics from "./pages/service/SQAnalytics";
// import TechnicianRecords from "./pages/technician/TechnicianRecords";
// import TechnicianHistory from "./pages/technician/TechnicianHistory";
// import Technician from "./pages/overview/TechnicianEfficiency";
// import Overview from "./pages/overview/Overview";
// import { AuthProvider } from "./hooks/AuthProvider";
// import ProtectedRoute from "./components/ProtectedRoute";
// import NotFound404 from "./components/NotFound404";
// import TechnicianFullHistory from "./pages/technician/TechnicianFullHistory";
// import UpdateTicket from "./pages/service/UpdateTicket";
// import AddUser from "./pages/adduser/AddUser";
// import UpdateUser from "./pages/updateuser/UpdateUser";
// import DeleteUser from "./pages/deleteuser/DeleteUser";
// import RedirectComponent from "./components/RedirectComponent";
// import RequestApproval from "./pages/service/RequestApproval";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<RootLayout />}>
//             <Route path="/" element={<RedirectComponent />} />
//             <Route
//               path="/home/technician"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <Technician />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/home/overview"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <Overview />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/assign"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager"]}>
//                   <UnAssignedTickets />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/add-user"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <AddUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/update-user"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <UpdateUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/delete-user"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <DeleteUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/assign/:TicketId"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager"]}>
//                   <AssignTicket />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/technician-records" element={<TechnicianRecords />} />
//             <Route
//               path="/technician-records/stats"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <TechnicianHistory />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/technician-records/history"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
//                   <TechnicianFullHistory />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/service/requests" element={<ServiceRequests />} />
//             <Route
//               path="/service/requests/:TicketId"
//               element={<UpdateTicket />}
//             />
//             <Route
//               path="/service/quality-analytics"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin", "MIS"]}>
//                   <SQAnalytics />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/service/RequestApproval"
//               element={
//                 <ProtectedRoute allowedRoles={["Manager", "Admin", "MIS"]}>
//                   <RequestApproval />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<NotFound404 />} />
//           </Route>
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;





import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import UnAssignedTickets from "./pages/assign/UnAssignedTickets";
import AssignTicket from "./pages/assign/AssignTicket";
import RootLayout from "./components/layout/RootLayout";
import ServiceRequests from "./pages/service/ServiceRequests";
import SQAnalytics from "./pages/service/SQAnalytics";
import TechnicianRecords from "./pages/technician/TechnicianRecords";
import TechnicianHistory from "./pages/technician/TechnicianHistory";
import Technician from "./pages/overview/TechnicianEfficiency";
import Overview from "./pages/overview/Overview";
import { AuthProvider } from "./hooks/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound404 from "./components/NotFound404";
import TechnicianFullHistory from "./pages/technician/TechnicianFullHistory";
import UpdateTicket from "./pages/service/UpdateTicket";
import AddUser from "./pages/adduser/AddUser";
import UpdateUser from "./pages/updateuser/UpdateUser";
import DeleteUser from "./pages/deleteuser/DeleteUser";
import RedirectComponent from "./components/RedirectComponent";
import RequestApproval from "./pages/service/RequestApproval";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<RedirectComponent />} />
            
            {/* Manager/Admin Only Routes */}
            <Route
              path="/home/technician"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <Technician />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/overview"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <Overview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <UnAssignedTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assign/:TicketId"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <AssignTicket />
                </ProtectedRoute>
              }
            />
            
            {/* User Management (Manager/Admin) */}
            <Route
              path="/add-user"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-user"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <UpdateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delete-user"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <DeleteUser />
                </ProtectedRoute>
              }
            />
            
            {/* Technician Data (Manager/Admin + View for Technicians) */}
            <Route path="/technician-records" element={<TechnicianRecords />} />
            <Route
              path="/technician-records/stats"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <TechnicianHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/technician-records/history"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
                  <TechnicianFullHistory />
                </ProtectedRoute>
              }
            />
            
            {/* Service Requests (All Roles) */}
            <Route path="/service/requests" element={<ServiceRequests />} />
            <Route
              path="/service/requests/:TicketId"
              element={<UpdateTicket />}
            />
            
            {/* Analytics & Approvals (Manager/Admin/MIS) */}
            <Route
              path="/service/quality-analytics"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin", "MIS"]}>
                  <SQAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service/RequestApproval"
              element={
                <ProtectedRoute allowedRoles={["Manager", "Admin", "MIS"]}>
                  <RequestApproval />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound404 />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;