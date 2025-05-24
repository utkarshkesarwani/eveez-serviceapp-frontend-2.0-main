// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/prop-types */
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useLayoutEffect,
// } from "react";
// import axiosInstance from "../service/api";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const [userLocation, setUserLocation] = useState("");
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const isTokenExpired = (token) => {
//     try {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
//       return decodedToken.exp < currentTime;
//     } catch (error) {
//       return true;
//     }
//   };
//   useLayoutEffect(() => {
//     const verifyUser = async () => {
//       setLoading(true);
//       const storedUser = localStorage.getItem("user");
//       const storedToken = localStorage.getItem("token");
//       if (storedToken && !isTokenExpired(storedToken)) {
//         setIsAuthenticated(true);
//         const userDetails = JSON.parse(storedUser);
//         setUserRole(userDetails.role);
//         setUserLocation(userDetails.location);
//         setUserName(userDetails.name);
//       } else {
//         setIsAuthenticated(false);
//         localStorage.clear();
//         navigate("/login");
//       }
//       setLoading(false);
//     };

//     verifyUser();
//   }, []);

//   const login = async (credentials) => {
//     const payload = {
//       key: import.meta.env.VITE_SERVER_KEY,
//       data: credentials,
//     };
//     try {
//       const response = await axiosInstance.post("/userlogin", payload);
//       setUserRole(response.data.Details.role);
//       setUserLocation(response.data.Details.location);
//       setUserName(response.data.Details.name);
//       localStorage.setItem("user", JSON.stringify(response.data?.Details));
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("userName", response.data.Details.name);
//       localStorage.setItem("userRole", response.data.Details.role);
//       localStorage.setItem("userLocation", response.data.Details.location);
//       setIsAuthenticated(true);
//       return response.data.Details.role;
//     } catch (error) {
//       setIsAuthenticated(false);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       setIsAuthenticated(false);
//       localStorage.clear();
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         login,
//         logout,
//         loading,
//         userRole,
//         userLocation,
//         setUserLocation,
//         userName,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };



import React, {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useCallback
} from "react";
import axiosInstance from "../service/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
    userLocation: "",
    userName: "",
    loading: true
  });
  const navigate = useNavigate();

  const validRoles = ["Manager", "Admin", "MIS", "Individual", "Technician"];

  const isTokenExpired = useCallback((token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp < Date.now() / 1000;
    } catch (error) {
      console.error("Token validation error:", error);
      return true;
    }
  }, []);

  const handleInvalidSession = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      userRole: null,
      userLocation: "",
      userName: "",
      loading: false
    }));
    localStorage.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  const verifyUser = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (!storedToken || isTokenExpired(storedToken)) {
        return handleInvalidSession();
      }

      try {
        const userDetails = JSON.parse(storedUser);
        
        if (!validRoles.includes(userDetails?.role)) {
          return handleInvalidSession();
        }

        setAuthState({
          isAuthenticated: true,
          userRole: userDetails.role,
          userLocation: userDetails.location,
          userName: userDetails.name,
          loading: false
        });
      } catch (parseError) {
        console.error("User data parsing error:", parseError);
        handleInvalidSession();
      }
    } catch (error) {
      console.error("Authentication verification error:", error);
      handleInvalidSession();
    }
  }, [isTokenExpired, handleInvalidSession]);

  useLayoutEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/userlogin", {
        key: import.meta.env.VITE_SERVER_KEY,
        data: credentials
      });

      const userDetails = response.data.Details;
      
      if (!validRoles.includes(userDetails?.role)) {
        throw new Error("Unauthorized role");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userDetails));
      
      setAuthState({
        isAuthenticated: true,
        userRole: userDetails.role,
        userLocation: userDetails.location,
        userName: userDetails.name,
        loading: false
      });

      return userDetails.role;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isAuthenticated: false, loading: false }));
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      userRole: null,
      userLocation: "",
      userName: "",
      loading: false
    });
    localStorage.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = {
    ...authState,
    login,
    logout,
    setUserLocation: (location) => 
      setAuthState(prev => ({ ...prev, userLocation: location }))
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};