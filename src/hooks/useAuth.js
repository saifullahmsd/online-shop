import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
} from "../features/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());
  const updateProfile = (data) => dispatch(updateUserProfile(data));

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
};

export default useAuth;
