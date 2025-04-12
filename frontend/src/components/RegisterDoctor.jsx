import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";

const RegisterDoctor = () => {
  const [doctorAddress, setDoctorAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const test = useWeb3();
  const { currentAccount, medicalRecordsContract } = useWeb3();

  //   console.log(test);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", content: "" });

    try {
      // Validate the doctor's address
      if (
        !doctorAddress ||
        !doctorAddress.startsWith("0x") ||
        doctorAddress.length !== 42
      ) {
        throw new Error("Please enter a valid Ethereum address");
      }

      // Register doctor on blockchain
      await medicalRecordsContract.methods
        .registerDoctor(doctorAddress)
        .send({ from: currentAccount });

      // Show success notification
      setMessage({
        type: "success",
        content: `Doctor with address ${doctorAddress} has been successfully registered!`,
      });

      // Clear form after successful submission
      setDoctorAddress("");
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        content: `Registration failed: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg bg-white mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Doctor Registration
        </h2>

        <p className="text-center text-gray-600">
          As the admin, you can register new doctors to grant them access to add
          and view medical records.
        </p>

        {message.content && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="doctorAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Doctor's Ethereum Address *
            </label>
            <input
              id="doctorAddress"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
              placeholder="0x..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the Ethereum address of the doctor you want to register
            </p>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Doctor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterDoctor;
