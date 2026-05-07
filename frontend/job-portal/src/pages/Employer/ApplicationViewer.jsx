import { useState, useEffect, useMemo } from "react";
import StatusBadge from "../../components/StatusBadge";
import { BASE_URL } from "../../utils/apiPaths";
import {
  Users,
  MapPin,
  Briefcase,
  ArrowLeft,
  Calendar,
  Download,
  Eye,
} from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getInitials } from "../../utils/helper";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";

const ApplicationViewer = () => {
  const location = useLocation();
  const jobId = location.state?.jobId || null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // DOWNLOAD RESUME
  const handleDownloadResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert("Resume not uploaded");
    }
  };

  // UPDATE STATUS
  const updateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId),
        { status }
      );

      fetchApplications();
    } catch (err) {
      console.log("Status update failed");
    }
  };

  // FETCH APPLICATIONS
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );

      setApplications(response.data);
    } catch (err) {
      console.log("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    } else {
      navigate("/manage-jobs");
    }
  }, []);

  // GROUP APPLICATIONS
  const groupedApplications = useMemo(() => {
    return applications.reduce((acc, app) => {
      const id = app.job._id;

      if (!acc[id]) {
        acc[id] = {
          job: app.job,
          applications: [],
        };
      }

      acc[id].applications.push(app);

      return acc;
    }, {});
  }, [applications]);

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>

            <p className="mt-4 text-gray-600">
              Loading applications...
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* HEADER */}
          <div className="mb-8 px-6 pt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/manage-jobs")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Applications Overview
              </h1>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {Object.keys(groupedApplications).length === 0 ? (
              <div className="text-center py-16">
                <Users className="mx-auto h-24 w-24 text-gray-300" />

                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No applications available
                </h3>

                <p className="mt-2 text-gray-500">
                  No applications found at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.values(groupedApplications).map(
                  ({ job, applications }) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      {/* JOB HEADER */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                        <h2 className="text-white font-semibold text-lg">
                          {job.title}
                        </h2>

                        <div className="flex gap-4 mt-2 text-blue-100 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>

                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </div>
                        </div>

                        <div className="mt-2 text-white text-sm">
                          {applications.length} Application
                          {applications.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* APPLICATION LIST */}
                      <div className="p-6 space-y-4">
                        {applications.map((application) => (
                          <div
                            key={application._id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            {/* LEFT */}
                            <div className="flex items-center gap-4">
                              {application.applicant.avatar ? (
  <img
    src={
      application.applicant.avatar.startsWith("http")
        ? application.applicant.avatar
        : `${BASE_URL}${application.applicant.avatar}`
    }
    alt={application.applicant.name}
    className="h-12 w-12 rounded-full object-cover"
  />
) : (
  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
    <span className="text-blue-600 font-semibold">
      {getInitials(application.applicant.name)}
    </span>
  </div>
)}

                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {application.applicant.name}
                                </h3>

                                <p className="text-gray-600 text-sm">
                                  {application.applicant.email}
                                </p>

                                <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                  <Calendar className="h-3 w-3" />

                                  <span>
                                    Applied{" "}
                                    {moment(
                                      application.createdAt
                                    ).format("Do MMM YYYY")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-3 mt-4 md:mt-0">
                              <StatusBadge status={application.status} />

                              {/* RESUME BUTTON */}
                              <button
                                onClick={() => {
                                  if (application.resume) {
                                    handleDownloadResume(
                                      `${BASE_URL}${application.resume}`
                                    );
                                  } else {
                                    alert("Resume not uploaded");
                                  }
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                              >
                                <Download className="h-4 w-4" />
                                Resume
                              </button>

                              {/* PROFILE BUTTON */}
                              <button
                                onClick={() =>
                                  setSelectedApplicant(application)
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                              >
                                <Eye className="h-4 w-4" />
                                View Profile
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* PROFILE MODAL */}
          {selectedApplicant && (
            <ApplicantProfilePreview
              selectedApplicant={selectedApplicant}
              setSelectedApplicant={setSelectedApplicant}
              handleDownloadResume={handleDownloadResume}
              handleClose={() => {
                setSelectedApplicant(null);
                fetchApplications();
              }}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;