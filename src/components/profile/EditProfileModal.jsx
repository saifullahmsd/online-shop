import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../features/auth/authSlice";
import { X, CircleNotch } from "phosphor-react";
import { toast } from "react-hot-toast";

const EditProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || "other",
    username: user?.username || "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update: " + error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border p-2.5 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border p-2.5 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-lg border p-2.5 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border p-2.5 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 flex w-full justify-center rounded-lg bg-primary py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
              <CircleNotch className="animate-spin" size={24} />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
