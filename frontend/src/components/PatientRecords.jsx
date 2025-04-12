// src/components/PatientRecords.jsx
import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { downloadFromIPFS } from "../utils/ipfsUtils";

const PatientRecords = () => {
  const { currentAccount, medicalRecordsContract, isPatient } = useWeb3();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState(
    localStorage.getItem("encryptionKey") || ""
  );
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [decryptedContent, setDecryptedContent] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);

  // Fetch patient records when component mounts
  useEffect(() => {
    if (medicalRecordsContract && currentAccount) {
      fetchRecords();
    }
  }, [medicalRecordsContract, currentAccount]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      // First check if the user is a registered patient
      if (!isPatient) {
        setError("Only registered patients can view their records");
        setLoading(false);
        return;
      }

      // Get patient details from the contract
      const patientDetails = await medicalRecordsContract.methods
        .getPatientDetails()
        .call({ from: currentAccount });

      // The third value returned is recordCount
      const recordCount = parseInt(patientDetails[2]);

      // Fetch all records
      const recordsArray = [];
      for (let i = 0; i < recordCount; i++) {
        const record = await medicalRecordsContract.methods
          .getRecordDetails(i)
          .call({ from: currentAccount });

        // Format the record data
        recordsArray.push({
          id: i,
          recordType: record[0],
          recordHash: record[1],
          timestamp: new Date(parseInt(record[2]) * 1000).toLocaleString(),
          doctorAddress: record[3],
          doctorName: record[4],
          metadata: record[5],
        });
      }

      setRecords(recordsArray);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to fetch records. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setDecryptedContent(null);
  };

  const handleDecrypt = async () => {
    // if (!decryptionKey) {
    //   alert("Please enter your decryption key");
    //   return;
    // }

    if (!selectedRecord) {
      alert("Please select a record to decrypt");
      return;
    }

    try {
      setLoading(true);

      // Download encrypted data from IPFS
      let encryptedData;

      try {
        encryptedData = await downloadFromIPFS(selectedRecord.recordHash);
        setDecryptedContent(encryptedData);
      } catch (ipfsError) {
        console.error("IPFS download error:", ipfsError);
        alert("Failed to download data from IPFS: " + ipfsError.message);
        return;
      }
    } catch (err) {
      console.error("General error in decryption process:", err);
      alert("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sending the medical data to AI
  const handleSendToAi = async () => {
    console.log("The decrypted content: ", decryptedContent);
    console.log("Current Account", currentAccount);

    try {
      setLoading(true);
      const response = await fetch(
        "https://normally-poetic-ferret.ngrok-free.app/api/process-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: decryptedContent,
            source_type: "raw",
            question: prompt,
            username: currentAccount,
          }),
        }
      );

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setAiResponse(data.answer);
    } catch (error) {
      console.error("Error sending data to AI:", error);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Medical Records</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading && !records.length ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Records List */}
          <div className="md:w-1/2">
            <h3 className="text-lg font-medium mb-4">Available Records</h3>

            {records.length === 0 ? (
              <div className="text-center p-4 border border-gray-200 rounded-md">
                No records found
              </div>
            ) : (
              <div className="border border-gray-200 rounded-md divide-y">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedRecord?.id === record.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleRecordClick(record)}
                  >
                    <h4 className="font-medium">{record.recordType}</h4>
                    <p className="text-sm text-gray-600">
                      Dr. {record.doctorName}
                    </p>
                    <p className="text-xs text-gray-500">{record.timestamp}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              className="mt-4 w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              onClick={fetchRecords}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh Records"}
            </button>
          </div>

          {/* Record Viewer */}
          <div className="md:w-1/2">
            <h3 className="text-lg font-medium mb-4">Record Viewer</h3>

            {selectedRecord ? (
              <div className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-lg">
                  {selectedRecord.recordType}
                </h4>
                <div className="my-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Doctor:</span>{" "}
                    {selectedRecord.doctorName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span>{" "}
                    {selectedRecord.timestamp}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">IPFS Hash:</span>{" "}
                    <span className="text-xs font-mono">
                      {selectedRecord.recordHash}
                    </span>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium mb-2">
                    Decryption Key
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
                    value={decryptionKey}
                    onChange={(e) => setDecryptionKey(e.target.value)}
                    placeholder="Enter your personal decryption key"
                  />

                  <button
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    onClick={handleDecrypt}
                    disabled={loading}
                  >
                    {loading ? "Decrypting..." : "Decrypt Record"}
                  </button>
                </div>
                {console.log(decryptedContent)}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-md p-8 text-center text-gray-500">
                Select a record from the list to view details
              </div>
            )}
          </div>
        </div>
      )}
      {decryptedContent && (
        <div className="mt-4 pt-4 border-t flex flex-col space-y-2">
          <h5 className="font-medium mb-2">Decrypted Content:</h5>
          <p>{decryptedContent}</p>
          <input
            type="text"
            placeholder="Ask to AI .. ?"
            value={prompt}
            disabled={loading}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleSendToAi}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Sending to AI ...." : "Send to AI"}
          </button>
        </div>
      )}
      {aiResponse && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="font-medium mb-2">AI Response:</h5>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
