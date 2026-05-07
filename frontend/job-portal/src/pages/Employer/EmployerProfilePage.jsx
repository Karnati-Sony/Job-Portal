import { useState } from "react";
import { Building2, Mail, Edit3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import { BASE_URL } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfileDetails from "./EditProfileDetails";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    ...profileData,
  });

  const [uploading, setUploading] = useState({
    avatar: false,
    logo: false,
  });

  const [saving, setSaving] = useState(false);

  // HANDLE INPUT CHANGE
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // HANDLE IMAGE CHANGE + UPLOAD
  const handleImageChange = async (e, type) => {
  const file = e.target.files[0];

  if (!file) return;

  const field =
    type === "avatar"
      ? "avatar"
      : "companyLogo";

  setUploading((prev) => ({
    ...prev,
    [type]: true,
  }));

  try {
    // Upload image first
    const imgUploadRes = await uploadImage(file);

    const uploadedUrl =
      imgUploadRes.imageUrl || "";

    // Save REAL uploaded URL only
    handleInputChange(field, uploadedUrl);

  } catch (error) {
    console.log("Image Upload Error:", error);

    toast.error("Image upload failed");

  } finally {
    setUploading((prev) => ({
      ...prev,
      [type]: false,
    }));
  }
};

  // SAVE PROFILE
  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      if (response.status === 200) {
        toast.success(
          "Profile Details Updated Successfully!"
        );

        setProfileData({ ...formData });

        updateUser({
          ...formData,
        });

        setEditMode(false);
      }

    } catch (error) {
      console.log("Profile Update Error:", error);

      toast.error("Failed to update profile");

    } finally {
      setSaving(false);
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setFormData({ ...profileData });

    setEditMode(false);
  };

  // EDIT MODE
  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
              <h1 className="text-xl font-medium text-white">
                Employer Profile
              </h1>

              <button
                onClick={() => setEditMode(true)}
                className="bg-white/10 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />

                <span>Edit Profile</span>
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* PERSONAL INFO */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h2>

                  <div className="flex items-center space-x-4">

                    {profileData.avatar && (
                      <img
                        src={
                          profileData.avatar?.startsWith("http")
                            ? profileData.avatar
                            : `${BASE_URL}${profileData.avatar}`
                        }
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                      />
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profileData.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4 mr-2" />

                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COMPANY INFO */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Company Information
                  </h2>

                  <div className="flex items-center space-x-4">

                    {profileData.companyLogo && (
                      <img
                        src={
                          profileData.companyLogo?.startsWith("http")
                            ? profileData.companyLogo
                            : `${BASE_URL}${profileData.companyLogo}`
                        }
                        alt="Company Logo"
                        className="w-20 h-20 rounded-lg object-cover border-4 border-blue-50"
                      />
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profileData.companyName}
                      </h3>

                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building2 className="w-4 h-4 mr-2" />

                        <span>Company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ABOUT COMPANY */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                  About Company
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
                  {profileData.companyDescription}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;