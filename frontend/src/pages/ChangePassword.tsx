import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";

import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { changePassword } from "../services/userService";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const message = await changePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(message);
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/profile")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-600"
        >
          <ArrowLeft size={17} />
          Back to Profile
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <KeyRound size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Change Password
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Update your account password.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-11 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-11 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowNew((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-11 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound size={17} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
