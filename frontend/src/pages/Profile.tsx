import { Edit3, KeyRound, Loader2, LogOut, Mail, User } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { logout } from "../services/authService";
import { getProfile } from "../services/userService";

const Profile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await getProfile();

        setUsername(user.username);
        setEmail(user.email);
      } catch (error: any) {
        setError(error.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 size={22} className="animate-spin" />
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Top Section */}
          <div className="flex flex-col items-center border-b border-slate-100 px-6 py-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {username}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{email}</p>
          </div>

          {/* Account Information */}
          <div className="space-y-5 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Account Information
            </h3>

            {/* Username */}
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <User size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Username</p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {username}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <Mail size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Email</p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-100 pt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Edit Profile */}
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  <Edit3 size={17} />
                  Edit Profile
                </button>

                {/* Change Password */}
                <button
                  onClick={() => navigate("/profile/change-password")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <KeyRound size={17} />
                  Change Password
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
