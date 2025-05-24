import React, { useState } from "react";
import toast from "react-hot-toast";
import { DeleteExistingUser } from "../../service/delete-user.service";
import { useAuth } from "../../hooks/AuthProvider";

const DeleteUser = () => {
  const [userData, setUserData] = useState({
    name: null,
    mob_number: null,
    email: null,
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = async () => {

    if (!userData.name || !userData.mob_number || !userData.email) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await DeleteExistingUser(userData);
      toast.success("User Deleted Successfully");
      setUserData({
        name: null,
        mob_number: null,
        email: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error Deleting user");
    }
  };

  return (
    <section>
      <header className="w-full bg-[#FF57330A] text-[#FF5733] p-4">
        <span className="text-xl font-medium">Delete User</span>
      </header>
      <main className="px-5 py-3 flex flex-col gap-5">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium text-[16px]">
                Name <span className="text-red-500">*</span>
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
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userData.mob_number}
                placeholder="Enter Mobile Number"
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
                Email <span className="text-red-500">*</span>
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
          </div>
        </section>

        {/* Warning Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Note: This action can only be performed for users with the Technician role. 
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-gray-600 border rounded-md"
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                  onClick={() => {
                    handleDelete();
                    setIsConfirmOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="flex justify-center items-center py-5">
        <button
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          onClick={() => setIsConfirmOpen(true)}
        >
          Delete User
        </button>
      </footer>
    </section>
  );
};

export default DeleteUser;