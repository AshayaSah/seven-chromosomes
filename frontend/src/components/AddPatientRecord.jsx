// src/components/AddRecord.js
import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { uploadToIPFS } from "../utils/ipfsUtils";

const AddPatientRecord = () => {
  const { currentAccount, medicalRecordsContract, isDoctor } = useWeb3();
  const [patientAddress, setPatientAddress] = useState(currentAccount);
  const [recordType, setRecordType] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [metadata, setMetadata] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileContent(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDoctor) {
      alert("Access denied. Only registered doctors can add medical records.");
      return;
    }

    if (!fileContent) {
      alert("Please select a medical record file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(fileContent);

      // Create metadata with additional information
      const metadataObj = {
        description: metadata,
        recordDate: new Date().toISOString(),
        fileType: fileContent.type,
      };

      // Add record to blockchain
      await medicalRecordsContract.methods
        .addRecord(
          patientAddress,
          recordType,
          ipfsHash,
          doctorName,
          JSON.stringify(metadataObj)
        )
        .send({ from: currentAccount });

      alert(
        "Record added successfully. The medical record has been added to the blockchain."
      );

      // Reset form
      setPatientAddress("");
      setRecordType("");
      setDoctorName("");
      setMetadata("");
      setFileContent(null);

      // Reset file input
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error(error);
      alert(`Failed to add record: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPatientEncryptionKey = async (patientAddress) => {
    // Pulling engryption Key use a dummy key
    const encryptionKey = localStorage.getItem("encryptionKey");
    return encryptionKey;
  };

  return (
    <div className="w-full mx-auto mt-4 max-w-2xl p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add Medical Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="patientAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Patient Ethereum Address *
            </label>
            <input
              id="patientAddress"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="recordType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Record Type *
            </label>
            <select
              id="recordType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select record type
              </option>
              <option value="Prescription">Prescription</option>
              <option value="Lab Report">Lab Report</option>
              <option value="Diagnosis">Diagnosis</option>
              <option value="Imaging">Imaging (X-Ray, MRI, etc.)</option>
              <option value="Surgery">Surgery Report</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="doctorName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Doctor Name *
            </label>
            <input
              id="doctorName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Dr. ..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="fileInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Medical Record File *
            </label>
            <input
              id="fileInput"
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="metadata"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes
            </label>
            <textarea
              id="metadata"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder="Add any additional information about this record"
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload Record to Blockchain"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientRecord;
