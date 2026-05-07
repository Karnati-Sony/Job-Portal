import {
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import moment from "moment";
import StatusBadge from "../../components/StatusBadge";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { user } = useAuth();
  const { jobId } = useParams();

  const [jobDetails, setJobDetails] = useState(null);

  // APPLY MODAL
  const [showApplyModal, setShowApplyModal] = useState(false);

  // FORM DATA
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    country: "",
    coverLetter: "",
    resume: null,
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // GET JOB DETAILS
  const getJobDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?._id || null },
        }
      );

      setJobDetails(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  // APPLY TO JOB
  const applyToJob = async () => {
    try {
      // VALIDATION
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone ||
        !formData.country ||
        !formData.resume
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const submitData = new FormData();

      submitData.append("firstName", formData.firstName);
      submitData.append("middleName", formData.middleName);
      submitData.append("lastName", formData.lastName);
      submitData.append("phone", formData.phone);
      submitData.append("country", formData.country);
      submitData.append("coverLetter", formData.coverLetter);
      submitData.append("resume", formData.resume);

      await axiosInstance.post(
        API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId),
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Application Submitted Successfully");

      setShowApplyModal(false);

      getJobDetailsById();

    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
          "Something went wrong! Try again later"
      );
    }
  };

  useEffect(() => {
    if (jobId && user) {
      getJobDetailsById();
    }
  }, [jobId, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">

        {jobDetails && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-6">

              {/* LEFT */}
              <div className="flex items-start gap-5 flex-1">

               {jobDetails?.company?.companyLogo ? (
  <img
    src={jobDetails.company.companyLogo}
    alt="Company Logo"
    className="h-20 w-20 object-cover rounded-xl border"
  />
) : (
                  <div className="h-20 w-20 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <div className="space-y-3">

                  <h1 className="text-2xl font-bold text-gray-900">
                    {jobDetails.title}
                  </h1>

                  <div className="flex items-center gap-6 text-gray-600 text-sm">

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {jobDetails.location}
                    </div>

                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-3 pt-2">

                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                      {jobDetails.category}
                    </span>

                    <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                      {jobDetails.type}
                    </span>

                    <span className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">

                      <Clock className="h-4 w-4" />

                      {jobDetails.createdAt
                        ? moment(jobDetails.createdAt).format("Do MMM YYYY")
                        : "N/A"}

                    </span>

                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div>

                {jobDetails?.applicationStatus ? (

                  <StatusBadge
                    status={jobDetails.applicationStatus}
                  />

                ) : (

                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    Apply Now
                  </button>

                )}

              </div>
            </div>

            {/* SALARY */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="p-3 bg-emerald-500 rounded-lg">
                  <DollarSign className="text-white h-5 w-5" />
                </div>

                <div>

                  <p className="text-sm text-gray-600">
                    Compensation
                  </p>

                  <p className="text-xl font-bold text-gray-900">

                    {jobDetails.salaryMin} – {jobDetails.salaryMax}

                    <span className="text-gray-600 font-normal text-base ml-1">
                      per year
                    </span>

                  </p>

                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">

                <Users className="h-4 w-4" />

                Competitive

              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-4">

              <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3">
                About This Role
              </h3>

              <div className="bg-gray-50 p-6 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {jobDetails.description}
              </div>

            </div>

            {/* REQUIREMENTS */}
            <div className="space-y-4">

              <h3 className="text-lg font-semibold border-l-4 border-purple-500 pl-3">
                What We're Looking For
              </h3>

              <div className="bg-purple-50 p-6 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {jobDetails.requirements}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-6">
              Apply For Job
            </h2>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle Name"
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="border rounded-lg px-4 py-3 bg-gray-100 md:col-span-2"
              />

              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 md:col-span-2"
              >

                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>

              </select>

              <div className="md:col-span-2">

  <label className="block mb-2 text-sm font-medium text-gray-700">
    Resume
  </label>

  <label
    htmlFor="resumeUpload"
    className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:border-blue-500 transition-all bg-white"
  >

    <span className="text-gray-700 truncate">

      {formData.resume
        ? formData.resume.name
        : "Upload Resume"}

    </span>

    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
      Browse
    </span>

  </label>

  <input
    id="resumeUpload"
    type="file"
    accept=".pdf,.doc,.docx"
    className="hidden"
    onChange={(e) =>
      setFormData({
        ...formData,
        resume: e.target.files[0],
      })
    }
  />

</div>
              <textarea
                rows="5"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Cover Letter (Optional)"
                className="border rounded-lg px-4 py-3 md:col-span-2"
              />

            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => setShowApplyModal(false)}
                className="px-6 py-3 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={applyToJob}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              >
                Submit Application
              </button>

            </div>

          </div>
        </div>

      )}

    </div>
  );
};

export default JobDetails;