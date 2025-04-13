import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";
import { generateEncryptionKey } from "../utils/encryptionUtils";

const RegisterPatient = () => {
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [secret, setSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentAccount, medicalRecordsContract } = useWeb3();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("The patient ID: ", patientId);
      // Generate encryption key and store it locally
      const encryptionKey = generateEncryptionKey(patientId, secret);
      localStorage.setItem("encryptionKey", encryptionKey);

      // Register patient on blockchain
      await medicalRecordsContract.methods
        .registerPatient(name, patientId)
        .send({ from: currentAccount });

      // Show success notification
      alert("Registration successful! You're now registered as a patient!");

      navigate("/patient-dashboard");
    } catch (error) {
      console.error(error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg bg-white mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Patient Registration
        </h2>

        <p className="text-center text-gray-600">
          Register to securely store your medical records on the blockchain.
          Your data will be encrypted and only accessible to you and those you
          grant permission.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="patientId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Patient ID (e.g., SSN or custom ID) *
            </label>
            <input
              id="patientId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter your identification number"
              required
            />
          </div>

          <div>
            <label
              htmlFor="secret"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Personal Secret (for encryption) *
            </label>
            <input
              id="secret"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter a secret phrase you'll remember"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This secret will be used to encrypt your medical records. We don't
              store this - if you forget it, you cannot recover your records.
            </p>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register as Patient"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;
