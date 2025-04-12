// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";

const Navbar = () => {
  const { isAdmin, currentAccount, connectWallet, isDoctor, isPatient } =
    useWeb3();

  console.log({ isAdmin, currentAccount, connectWallet, isDoctor, isPatient });
  const location = useLocation();

  // Function to check if the current route is active
  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-700" : "";
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white text-xl font-bold">
                MedChain
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link
                to="/"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/"
                )}`}
              >
                Home
              </Link>

              {isAdmin && (
                <Link
                  to="/register-doctor"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                    "/register-doctor"
                  )}`}
                >
                  Register Doctor
                </Link>
              )}

              {isPatient && (
                <Link
                  to="/records"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                    "/records"
                  )}`}
                >
                  My Records
                </Link>
              )}

              {isDoctor && (
                <Link
                  to="/add-patient-record"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                    "/add-patient-record"
                  )}`}
                >
                  Add Record
                </Link>
              )}

              {!isPatient && !isDoctor && !isAdmin && currentAccount && (
                <>
                  <Link
                    to="/register"
                    className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                      "/register"
                    )}`}
                  >
                    Register as Patient
                  </Link>
                </>
              )}

              <Link
                to="/about"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/about"
                )}`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {!currentAccount ? (
              <button
                onClick={connectWallet}
                className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="text-white text-sm font-medium truncate max-w-[200px]">
                {currentAccount.substring(0, 6)}...
                {currentAccount.substring(currentAccount.length - 4)}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
              "/"
            )}`}
          >
            Home
          </Link>

          {isAdmin && (
            <Link
              to="/register-doctor"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/register-doctor"
              )}`}
            >
              Register Doctor
            </Link>
          )}

          {isPatient && (
            <Link
              to="/records"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/records"
              )}`}
            >
              My Records
            </Link>
          )}

          {isDoctor && (
            <Link
              to="/add-record"
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/add-record"
              )}`}
            >
              Add Record
            </Link>
          )}

          {!isPatient && !isDoctor && !isAdmin && currentAccount && (
            <>
              <Link
                to="/register"
                className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/register"
                )}`}
              >
                Register as Patient
              </Link>
            </>
          )}

          <Link
            to="/about"
            className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive(
              "/about"
            )}`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
