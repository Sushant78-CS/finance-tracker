import { ArrowLeft, Loader2, Mail, Save, User } from "lucide-react";

import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getProfile, updateProfile } from "../services/userService";

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !email.trim()) {
      setError("Username and email are required.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile(username.trim(), email.trim());

      navigate("/profile");
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-600" />
        </div>
      </div>
    );
  }

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>

            <p className="mt-1 text-sm text-slate-500">
              Update your personal information.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
