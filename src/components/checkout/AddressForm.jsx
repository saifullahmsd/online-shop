import React from "react";

const AddressForm = ({ formData, handleChange }) => {
  const inputClasses =
    "w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-700";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
        Shipping Information
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClasses}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
            placeholder="+1 234 567 890"
            required
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={inputClasses}
            placeholder="123 Main St, Apt 4B"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClasses}
            placeholder="New York"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={inputClasses}
            placeholder="10001"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
