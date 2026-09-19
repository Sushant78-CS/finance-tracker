import { LogOut, Menu, User, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => goTo("/home")}
          className="flex items-center gap-2"
        >
          <div className="text-left">
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              Finance Tracker
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Manage your money
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => goTo("/home")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => goTo("/profile")}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
          >
            <User size={17} />
            Profile
          </button>

          {/* User */}
          <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="hidden text-right lg:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.username || "User"}
              </p>

              <p className="max-w-40 truncate text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="space-y-2">
            {/* Mobile User */}
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.username || "User"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => goTo("/home")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-600"
            >
              <Wallet size={18} />
              Dashboard
            </button>

            <button
              onClick={() => goTo("/profile")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-600"
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
