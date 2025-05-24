// Login.jsx
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RxEyeClosed } from "react-icons/rx";
import { FiEye } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import LoginImage from "../../assets/login.png";
import eveezLogo from "../../assets/eveezLogoLarge.png";
import { useAuth } from "../../hooks/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [mobileno, setMobileNo] = useState("");
  const [password, setpassword] = useState("");

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    const userData = {
      mob_number: mobileno,
      password: password,
    };
    if (!userData.password || !userData.mob_number) {
      toast.error("Fields cannot be empty");
    } else {
      try {
        const userRole = await login(userData);
        toast.success("User logged in successfully");
        
        // Updated role-based redirection
        if (["Manager", "Admin"].includes(userRole)) {
          navigate("/home/overview", { replace: true });
        } else if (userRole === "MIS") {
          navigate("/service/requests", { replace: true });
        } else {
          navigate("/service/requests", { replace: true });
        }
      } catch (error) {
        console.error(error);
        toast.error("Invalid credentials");
      }
    }
  };

  const handleShowPassword = useCallback(
    () => setShowPassword(!showPassword),
    [showPassword]
  );

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 h-screen w-full overflow-hidden">
      <Toaster />
      <img
        src={eveezLogo}
        alt="logo"
        className="fixed z-10 h-12 left-6 sm:left-12 top-10"
      />
      <div className="fixed sm:static h-full z-0">
        <img
          src={LoginImage}
          alt="vehicle"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="z-10 flex items-center justify-center px-4">
        <div className="sm:w-[485px] w-full h-auto p-4 py-6 border rounded-lg bg-white">
          <h1 className="text-4xl font-[800] text-black">Log in.</h1>
          <p className="text-lg text-[#6C6C6C] my-2">
            Unlock Insights and Drive Your Success
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-10"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="mob_number"
                className="font-semibold text-sm text-[#444444]"
              >
                Mobile No
              </label>
              <input
                type="text"
                id="mob_number"
                value={mobileno}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="Enter your phone number or email"
                className="border border-[#DED2D9] h-12 px-1 w-full rounded placeholder:text-[#D5D5D5] placeholder:text-sm text-black font-medium focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="font-semibold text-sm text-[#444444]"
              >
                Password
              </label>
              <div className="relative">
                <div className="relative flex items-center border border-[#DED2D9] h-12 w-full rounded">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="Enter password"
                    className=" outline-none h-full px-1 w-full rounded placeholder:text-[#D5D5D5] placeholder:text-sm text-black font-medium border-none  focus:ring-0"
                  />
                  <div className="absolute right-4">
                    {showPassword ? (
                      <FiEye
                        onClick={() => setShowPassword(false)}
                        size={20}
                        color="#FF5733"
                        className="cursor-pointer"
                      />
                    ) : (
                      <RxEyeClosed
                        onClick={handleShowPassword}
                        size={20}
                        color="#FF5733"
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full h-[54px] cursor-pointer bg-[#FF5733] text-center text-white text-lg rounded my-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;