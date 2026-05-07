import {
  MapPin,
  DollarSign,
  ArrowLeft,
  Building2,
  Clock,
  Users,
} from "lucide-react";

import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();
  const currencies = [{ value: "usd", label: "$" }];

  const currencySymbol =
    currencies.find((c) => c.value === formData.currency)?.label || "$";

  const categoryLabel =
    CATEGORIES.find((c) => c.value === formData.category)?.label;

  const jobTypeLabel =
    JOB_TYPES.find((j) => j.value === formData.jobType)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-white shadow-xl rounded-2xl px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Job Preview
          </h2>

          <button
            onClick={() => setIsPreview(false)}
            className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Edit</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">

          {/* Hero Section */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {formData.jobTitle}
              </h1>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{formData.location}</span>
              </div>
            </div>

            {user?.companyLogo ? (
              <img
                src={user.companyLogo}
                alt="Company Logo"
                className="h-16 w-16 object-cover rounded-xl border"
              />
            ) : (
              <div className="h-16 w-16 bg-gray-100 border rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3">
            {categoryLabel && (
              <span className="px-4 py-2 bg-blue-50 text-sm text-blue-700 font-semibold rounded-full border border-blue-200">
                {categoryLabel}
              </span>
            )}

            {jobTypeLabel && (
              <span className="px-4 py-2 bg-purple-50 text-sm text-purple-700 font-semibold rounded-full border border-purple-200">
                {jobTypeLabel}
              </span>
            )}

            <div className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-sm text-gray-700 font-semibold rounded-full border border-gray-200">
              <Clock className="h-4 w-4" />

              <span>Posted today</span>
            </div>
          </div>

          {/* Compensation Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full -translate-y-16 translate-x-16"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Compensation
                  </h3>

                  <div className="text-lg font-bold text-gray-900">
                    {currencySymbol}
                    {Number(formData.salaryMin).toLocaleString()} -{" "}
                    {currencySymbol}
                    {Number(formData.salaryMax).toLocaleString()}
                    <span className="text-sm text-gray-600 font-normal ml-1">
                      per year
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <Users className="h-4 w-4" />
                <span>Competitive</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <span>About This Role</span>
            </h3>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {formData.description}
              </p>
            </div>
          </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full "></div>
                <span className="text-base md:text-lg">What We're Looking For</span>
              </h3>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formData.requirements}
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
