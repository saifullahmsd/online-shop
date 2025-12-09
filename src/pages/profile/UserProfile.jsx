import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileModal from "../../components/profile/EditProfileModal";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
          Personal Information
        </h2>

        <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
          <div className="flex-shrink-0">
            <img
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
              }
              alt={user.firstName}
              className="h-32 w-32 rounded-full border-4 border-gray-100 object-cover dark:border-slate-700"
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 text-gray-800 dark:text-gray-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                First Name
              </label>
              <p className="mt-1 text-lg font-medium">{user.firstName}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Last Name
              </label>
              <p className="mt-1 text-lg font-medium">{user.lastName}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <p className="mt-1 text-lg font-medium">{user.email}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Gender
              </label>
              <p className="mt-1 text-lg font-medium capitalize">
                {user.gender || "Not specified"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Username
              </label>
              <p className="mt-1 text-lg font-medium">
                @{user.username || "user"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-primary dark:hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
};

export default UserProfile;
