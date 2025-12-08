import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { CircleNotch } from "phosphor-react";
import PageTransition from "../components/shared/PageTransition";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Dispatch the Firebase Register action
    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      navigate("/"); // Redirect to Home or Dashboard
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-gray-400";

  return (
    <PageTransition>
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700">
          <h1 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="mb-8 text-center text-gray-500 dark:text-gray-400">
            Join us for exclusive deals
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={inputClass}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={inputClass}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className={inputClass}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              className={inputClass}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-3 font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300 dark:hover:bg-blue-600"
            >
              {loading ? (
                <CircleNotch className="animate-spin" size={24} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline dark:text-blue-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
