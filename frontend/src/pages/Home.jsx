// src/components/Homepage.js
import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";

const Homepage = () => {
  const { currentAccount, connectWallet, isDoctor, isPatient } = useWeb3();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Secure Medical Records on the Blockchain
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
            MedChain provides a secure, transparent, and patient-controlled
            platform for managing medical records using blockchain technology.
          </p>
          <div className="mt-10 flex justify-center">
            {!currentAccount ? (
              <button
                onClick={connectWallet}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 shadow-md"
              >
                Connect Wallet to Get Started
              </button>
            ) : !isPatient && !isDoctor ? (
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 shadow-md"
                >
                  Register as Patient
                </Link>
              </div>
            ) : isPatient ? (
              <Link
                to="/patient-dashboard"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 shadow-md"
              >
                View Your Medical Records
              </Link>
            ) : (
              <Link
                to="/add-record"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 shadow-md"
              >
                Add New Medical Record
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            How MedChain Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure Encryption
              </h3>
              <p className="text-gray-600">
                All medical records are encrypted using advanced cryptography
                before being stored, ensuring only authorized parties can access
                your data.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Patient Control
              </h3>
              <p className="text-gray-600">
                Patients have full control over who can access their medical
                records, granting and revoking permissions as needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Immutable Records
              </h3>
              <p className="text-gray-600">
                Once a record is added to the blockchain, it cannot be altered
                or deleted, ensuring a complete and trustworthy medical history.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Getting Started is Easy
          </h2>
          <div className="relative">
            {/* Steps Line */}
            <div className="hidden md:block absolute top-12 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative z-10">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Connect Wallet
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect your Ethereum wallet to the MedChain platform.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative z-10">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Register Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Register as a patient or healthcare provider on the platform.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative z-10">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Upload Records
                </h3>
                <p className="text-gray-600 text-sm">
                  Healthcare providers can securely add medical records to the
                  blockchain.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative z-10">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Manage Access
                </h3>
                <p className="text-gray-600 text-sm">
                  Patients can control who has access to their medical
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-white">
            Ready to take control of your medical records?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join MedChain today and experience the future of healthcare data
            management.
          </p>
          <div className="mt-8">
            {!currentAccount ? (
              <button
                onClick={connectWallet}
                className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md"
              >
                Connect Wallet
              </button>
            ) : !isPatient && !isDoctor ? (
              <Link
                to="/register"
                className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md"
              >
                Register Now
              </Link>
            ) : (
              <Link
                to={isPatient ? "/patient-dashboard" : "/add-record"}
                className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white font-bold text-xl">MedChain</p>
            <p className="text-gray-400 text-sm">
              Secure medical records on the blockchain
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} MedChain. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
