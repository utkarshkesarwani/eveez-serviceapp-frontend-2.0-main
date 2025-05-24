import React, { useState } from "react";
import toast from "react-hot-toast";
import { UpdateExistingUser } from "../../service/update-user.service";
import { useAuth } from "../../hooks/AuthProvider";
import { Select } from "antd";

const UpdateUser = () => {
  const { userRole, userLocation } = useAuth();
  
  const [userData, setUserData] = useState({
    current_mob_number: null,
    current_email: null,
    new_name: null,
    new_mob_number: null,
    new_email: null,
    location: userRole === "Admin" ? null : userLocation,
  });

  const UpdateUser = async () => {
    
    if (!userData.current_mob_number || !userData.current_email) {
      toast.error("Current mobile number and email are required");
      return;
    }

    if (!userData.new_name && !userData.new_mob_number && !userData.new_email) {
      toast.error("Please provide at least one field to update");
      return;
    }

    try {
      const res = await UpdateExistingUser(userData);
      toast.success("User Updated Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error Updating user");
    }
  };

  return (
    <section>
      <header className="w-full bg-[#FF57330A] text-[#FF5733] p-4">
        <span className="text-xl font-medium">Update User</span>
      </header>
      <main className="px-5 py-3 flex flex-col gap-5">
        <section>
          <h2 className="font-medium text-lg mb-3">Current User Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Current Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userData.current_mob_number}
                placeholder="Enter Current Mobile Number"
                className="rounded-md py-1.5"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    current_mob_number: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Current Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userData.current_email}
                placeholder="Enter Current Email"
                className="rounded-md py-1.5"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    current_email: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-3">New User Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                New Name
              </label>
              <input
                type="text"
                value={userData.new_name}
                placeholder="Enter New Name"
                className="rounded-md py-1.5"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    new_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                New Email
              </label>
              <input
                type="text"
                value={userData.new_email}
                className="rounded-md py-1.5"
                placeholder="Enter New Email"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    new_email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                New Mobile Number
              </label>
              <input
                type="text"
                value={userData.new_mob_number}
                placeholder="Enter New Mobile Number"
                className="rounded-md py-1.5"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    new_mob_number: e.target.value,
                  }))
                }
              />
            </div>

            {userRole === "Admin" && (
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label htmlFor="" className="font-medium text-[16px]">
                 New Location
                </label>
                <Select
                  placeholder="Select User Location"
                  size="large"
                  value={userData.location}
                  className="focus:ring-0"
                  onChange={(value) =>
                    setUserData((prev) => ({ ...prev, location: value }))
                  }
                  options={[
                    { value: "NCR", label: "NCR" },
                    { value: "Bangalore", label: "Bangalore" },
                    { value: "Chandigarh", label: "Chandigarh" },
                    { value: "Kolkata", label: "Kolkata" },
                    { value: "Hyderabad", label: "Hyderabad" },
                  ]}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="flex justify-center items-center py-5">
        <button
          className="px-3 py-1 border-[#FF5733] bg-[#FF5733] text-white font-semibold rounded-md"
          onClick={UpdateUser}
        >
          Update User
        </button>
      </footer>
    </section>
  );
};

export default UpdateUser;