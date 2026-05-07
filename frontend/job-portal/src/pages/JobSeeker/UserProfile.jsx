import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadFile from "../../utils/uploadImage";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [formData, setFormData] = useState({ ...profileData });

  const [uploading, setUploading] = useState({
    avatar: false,
  });

  const [saving, setSaving] = useState(false);

  // Sync user data
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      };

      setProfileData(userData);
      setFormData(userData);
    }
  }, [user]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Upload avatar
  const handleImageUpload = async (file) => {
    setUploading({ avatar: true });

    try {
      const uploadedUrl = await uploadFile(file);

      if (uploadedUrl) {
        handleInputChange("avatar", uploadedUrl);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setUploading({ avatar: false });
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);

      handleInputChange("avatar", previewUrl);

      handleImageUpload(file);
    }
  };

  // Save profile
  const handleSave = async () => {
    if (uploading.avatar) {
      toast.error("Please wait for upload to finish");
      return;
    }

    setSaving(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      if (response.status === 200) {
        toast.success("Profile Updated Successfully!");

        setProfileData({ ...formData });

        updateUser({ ...formData });
      }
    } catch (error) {
      console.error("Update failed:", error);

      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setFormData({ ...profileData });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16 lg:m-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
              <h1 className="text-xl font-medium text-white">
                Profile
              </h1>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">

              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={formData?.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />

                  {uploading.avatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300
                  rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">

                <Link
                  onClick={handleCancel}
                  to="/find-jobs"
                  className="px-6 py-3 border border-gray-300
                  text-gray-700 rounded-lg hover:bg-gray-50
                  flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Link>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 disabled:opacity-50
                  flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  <span>
                    {saving ? "Saving..." : "Save Changes"}
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;