import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CreateNewUser } from "../../service/add-user.service";
import { useAuth } from "../../hooks/AuthProvider";
import { Select } from "antd";
import { RxEyeClosed } from "react-icons/rx";
import { FiEye } from "react-icons/fi";
import { getLocation } from "../../service/location.service";
const AddUser = () => {
  const { userRole, userLocation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [userData, setUserData] = useState({
    name: null,
    mob_number: null,
    email: null,
    location: userRole === "Admin" ? null : userLocation,
    status: "Active",
    role: null,
    password: null,
  });

  const [locationOption, setLocationOption] = useState([]);

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

  useEffect(() => {
    getCity();
  }, []);

  const CreateUser = async () => {
    if (userData.password !== confirmPassword) {
      toast.error("Password doesn't match");
      return;
    }
    try {
      const res = await CreateNewUser(userData);
      toast.success("User Created Succesfully");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error Creating user";
      toast.error(errorMessage);
    }
  };
  const Roles = [
    {
      userRole: "Technician",
      allowedToCreate: ["Manager", "Admin"],
    },
    {
      userRole: "Inventory Manager",
      allowedToCreate: ["Manager", "Admin"],
    },
    {
      userRole: "Manager",
      allowedToCreate: ["Admin"],
    },
  ];
  const handleShowPassword = useCallback(
    () => setShowPassword(!showPassword),
    [showPassword]
  );

  return (
    <section>
      <header className="w-full bg-[#FF57330A] text-[#FF5733] p-4">
        <span className="text-xl font-medium">Create New User</span>
      </header>
      <main className="px-5 py-3 flex flex-col gap-5">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Name
              </label>
              <input
                type="text"
                value={userData.name}
                placeholder="Enter Name"
                className="rounded-md py-1.5"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Email
              </label>
              <input
                type="text"
                value={userData.email}
                className="rounded-md py-1.5"
                placeholder="Enter Email"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Mobile Number
              </label>
              <input
                type="text"
                value={userData.mob_number}
                placeholder="Enter mobile Number"
                className="rounded-md py-1.5"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    mob_number: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Role
              </label>
              <Select
                placeholder="Select Issue Type"
                size="large"
                value={userData.role}
                className="focus:ring-0"
                onChange={(value) =>
                  setUserData((prev) => ({ ...prev, role: value }))
                }
                options={Roles.filter((role) =>
                  role.allowedToCreate.includes(userRole)
                ).map((role) => ({
                  label: role.userRole,
                  value: role.userRole,
                }))}
              />
            </div>
            {userRole === "Admin" && (
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="" className="font-medium text-[16px]">
                  Location
                </label>
                <Select
                  placeholder="Select User Location"
                  size="large"
                  value={userData.location}
                  className="focus:ring-0"
                  onChange={(value) =>
                    setUserData((prev) => ({ ...prev, location: value }))
                  }
                  options={locationOption}
                />
              </div>
            )}
          </div>
        </section>
        <section>
          <main className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-[16px]">
                Password
              </label>
              <div className="relative">
                <div className="relative flex items-center border border-[#DED2D9] h-10 w-full rounded-md">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter password"
                    className=" outline-none h-full px-1 w-full rounded-md placeholder:text-[#D5D5D5] placeholder:text-sm text-black font-medium border-none  focus:ring-0"
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
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-[16px]">
                Confirm Password
              </label>
              <div className="relative">
                <div className="relative flex items-center border border-[#DED2D9] h-10 w-full rounded-md">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className=" outline-none h-full px-1 w-full rounded-md placeholder:text-[#D5D5D5] placeholder:text-sm text-black font-medium border-none  focus:ring-0"
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
                {userData.password !== confirmPassword && (
                  <span className="text-xs text-red-500 pl-1">
                    Password doesn't match
                  </span>
                )}
              </div>
            </div>
          </main>
        </section>
      </main>
      <footer className="flex justify-center items-center py-5">
        <button
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          onClick={CreateUser}
        >
          Create user
        </button>
      </footer>
    </section>
  );
};

export default AddUser;
