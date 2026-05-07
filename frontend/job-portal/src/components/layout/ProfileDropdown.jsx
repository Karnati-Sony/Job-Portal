import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyLogo,
  companyName,
  email,
  userRole,
  onLogout,
}) => {
  const navigate = useNavigate();
  const formatImageUrl = (url) => {
  if (!url) return "";

  return url.startsWith("http")
  ? url
  : `${BASE_URL}${url}`;
};

const imageUrl =
  userRole === "employer"
    ? formatImageUrl(companyLogo || avatar)
    : formatImageUrl(avatar);
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Avatar"
            className="h-9 w-9 object-cover rounded-xl"
          />
        ) : (
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {(companyName || email)?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {companyName || "Employer"}
          </p>
          <p className="text-xs text-gray-500 capitalize">{userRole}</p>
        </div>

        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">
              {companyName || "Employer"}
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <button
            onClick={() =>
              navigate(
                userRole === "jobseeker"
                  ? "/profile"
                  : "/company-profile"
              )
            }
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            View Profile
          </button>

          <div className="border-t mt-2 pt-2">
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
