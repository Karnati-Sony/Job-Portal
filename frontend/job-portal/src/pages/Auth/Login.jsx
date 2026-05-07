import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { BASE_URL, API_PATHS } from "../../utils/apiPaths";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Login = () => {
  const {login} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  });

  /* ---------------- Validation functions ---------------- */
  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };

  /* ---------------- Handlers ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
   
    // Clear error when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }));
    }
  };

  const validateForm = () =>{ 
   const errors = {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password)
   };

   // Remove empty errors
   Object.keys(errors).forEach(key => {
     if (!errors[key]) delete errors[key];
   });

   setFormState(prev => ({ ...prev, errors }));
   return Object.keys(errors).length === 0;
  };
const handleSubmit = async () => {
  console.log("HANDLE SUBMIT TRIGGERED");

  setFormState((prev) => ({ ...prev, loading: true }));

  try {
    const response = await axios.post(
      `${BASE_URL}${API_PATHS.AUTH.LOGIN}`,
      {
        email: formData.email,
        password: formData.password,
      }
    );

    console.log("LOGIN RESPONSE:", response.data);

    const { token, role } = response.data;

    localStorage.setItem("token", token);
    login(response.data, token);

    setFormState((prev) => ({
      ...prev,
      loading: false,
      success: true,
      errors: {},
    }));

    setTimeout(() => {
      window.location.href =
        role === "employer" ? "/employer-dashboard" : "/find-jobs";
    }, 1000);

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    setFormState((prev) => ({
      ...prev,
      loading: false,
      errors: {
        submit:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      },
    }));
  }
};

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1,scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">
            You have been successfuly logged in.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            Sign in to your JobPortal account
          </p>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your email"
              />
            </div>
            {formState.errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              </div>
            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
            )}
          </div>

            {/* Submit Error */}
            {formState.errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {formState.errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
           <button
              type="button"
               onClick={handleSubmit}
               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg"
             >
  {formState.loading ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Signing In...</span>
    </>
  ) : (
    <span>Sign In</span>
  )}
</button>


            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                   Create one here
                </a>
              </p>
            </div>
         
        </div>
      </motion.div>
    </div>
  );
};

export default Login;