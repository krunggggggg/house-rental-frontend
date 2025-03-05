import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-300 to-gray-500 text-gray-900 w-64 p-5 transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform md:translate-x-0 shadow-lg`}
    >
      <button
        className="md:hidden absolute top-4 right-4 text-gray-900 hover:text-gray-700"
        onClick={toggleSidebar}
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-400 transition"
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to="/tenants"
            className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-400 transition"
          >
            Tenants
          </Link>
        </li>
        <li>
          <Link
            to="/payments"
            className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-400 transition"
          >
            Payments
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-400 transition"
          >
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
