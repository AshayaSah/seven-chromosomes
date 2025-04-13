// src/components/PatientRecords.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeb3 } from "../contexts/Web3Context";
import { downloadFromIPFS } from "../utils/ipfsUtils";
import FileViewer from "./FileViewer";
import { useNavigate } from "react-router-dom";

const PatientRecords = () => {
  const { currentAccount, medicalRecordsContract, isPatient } = useWeb3();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isPatient) {
      navigate("/");
    }
  }, [currentAccount, isPatient, navigate]);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState(
    localStorage.getItem("encryptionKey") || ""
  );
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [decryptedContent, setDecryptedContent] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);

  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

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
        setFileBlob(encryptedData);
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

      chatHistory.push(prompt);

      // Step 1: Convert Blob to Text
      const decryptedContent = await fileBlob.text();
      // console.log(decryptedContent);

      const response = await fetch(process.env.PATIENT_API, {
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
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // console.log(data);
      setAiResponse(data.answer);

      chatHistory.push(data.answer);
    } catch (error) {
      console.error("Error sending data to AI:", error);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-4">
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          {loading && !records.length ? (
            <div className="flex justify-center my-8">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Records List */}
              <div className="md:w-full space-y-4">
                <h3 className="text-lg font-semibold">Available Records</h3>

                {records.length === 0 ? (
                  <Card>
                    <CardContent className="text-center text-muted-foreground">
                      No records found
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="divide-y gap-0 py-0">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 ${
                          selectedRecord?.id === record.id ? "bg-muted" : ""
                        }`}
                        onClick={() => handleRecordClick(record)}
                      >
                        <h4 className="font-medium">{record.recordType}</h4>
                        <p className="text-sm text-muted-foreground">
                          Dr. {record.doctorName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {record.timestamp}
                        </p>
                      </div>
                    ))}
                  </Card>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={fetchRecords}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Refresh Records"}
                </Button>
              </div>

              {/* Record Viewer */}
              <div className="md:w-full space-y-4">
                <h3 className="text-lg font-semibold">Record Viewer</h3>
                {selectedRecord ? (
                  <Card>
                    <CardContent className="space-y-4">
                      <h4 className="text-lg font-medium">
                        {selectedRecord.recordType}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Doctor:</strong> {selectedRecord.doctorName}
                        </p>
                        <p>
                          <strong>Date:</strong> {selectedRecord.timestamp}
                        </p>
                        <p className="overflow-auto">
                          <strong>IPFS Hash:</strong>{" "}
                          <span className="text-xs font-mono">
                            {selectedRecord.recordHash}
                          </span>
                        </p>
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        {/* <label className="text-sm font-medium">
                          Decryption Key
                        </label>
                        <Input
                          type="password"
                          value={decryptionKey}
                          onChange={(e) => setDecryptionKey(e.target.value)}
                          placeholder="Enter your personal decryption key"
                        /> */}

                        <Button
                          className="w-full"
                          onClick={handleDecrypt}
                          disabled={loading}
                        >
                          {loading ? "Decrypting..." : "Decrypt Record"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center text-muted-foreground p-8">
                      Select a record from the list to view details
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Content  */}
      <Card className="w-full md:w-2/3 flex flex-col p-6">
        <Card className="min-h-1/4 pb-6 ">
          <h5 className="pl-6 pb-2 font-medium border-b">Decrypted Content:</h5>
          <CardContent className="overflow-auto">
            {/* {decryptedContent ?? (
              <p className="overflow-auto">{decryptedContent}</p>
            )} */}

            <FileViewer fileBlob={fileBlob} />
          </CardContent>
        </Card>
        <Card className=" p-4 h-3/4">
          <h5 className="pl-6 pb-2 font-medium border-b">
            Disease Prediction AI
          </h5>
          <CardContent className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm max-w-[75%]">
                  Hello! How can I help you today?
                </div>
              </div>

              {/* {aiResponse && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 text-blue-800 rounded-lg px-4 py-2 text-sm max-w-[75%]">
                    {aiResponse}
                  </div>
                </div>
              )} */}

              {chatHistory &&
                chatHistory.map((chat, index) => {
                  const chatIndex = index + 1;

                  return chatIndex % 2 !== 0 ? (
                    <div key={index} className="flex justify-end">
                      <div className="bg-blue-100 rounded-lg px-4 py-2 text-sm max-w-[75%]">
                        {chat}
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="flex justify-start">
                      <div className="bg-secondary rounded-lg px-4 py-2 text-sm max-w-[75%]">
                        {chat}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-baseline gap-2">
              <Input
                type="text"
                placeholder="Ask something..."
                value={prompt}
                disabled={loading}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <Button onClick={handleSendToAi} disabled={loading || !fileBlob}>
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
};

export default PatientRecords;
