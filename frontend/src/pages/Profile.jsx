import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInterceptor";
import { toast } from "sonner";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfileData = async () => {
    try {
      const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/profile`);
      setProfile(response?.data?.data || response?.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch profile");
      console.error("Profile fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center text-xl text-blue-600 animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center text-red-600">
        <p className="text-xl">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        <div className="flex flex-col items-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-4 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center text-3xl text-white font-bold shadow-md">
              {profile.name?.charAt(0) || "U"}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800">{profile.name || "N/A"}</h2>
          <p className="text-gray-500">@{profile.user_id || "unknown_user"}</p>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Email:</span>
            <span className="font-medium">{profile.email || "N/A"}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Broker:</span>
            <span className="font-medium">{profile.broker || "Zerodha"}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Access:</span>
            <span className="font-medium">{profile.access_mode || "Read"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
