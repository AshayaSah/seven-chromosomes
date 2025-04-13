// src/components/AddRecord.js
import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { uploadToIPFS } from "../utils/ipfsUtils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const AddPatientRecord = () => {
  const { currentAccount, medicalRecordsContract, isDoctor } = useWeb3();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isDoctor) {
      navigate("/");
    }
  }, [currentAccount, isDoctor, navigate]);

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
    <Card className="w-full mx-auto mt-4 max-w-2xl p-8 border border-gray-200 shadow-lg bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-muted-foreground">
          Add Medical Record
        </CardTitle>
      </CardHeader>

      <Card>
        <CardContent className="space-y-5 w-full text-muted-foreground">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ethereum Address */}
            <div className="space-y-2">
              <Label htmlFor="patientAddress" className=" font-medium">
                Patient Ethereum Address *
              </Label>
              <Input
                id="patientAddress"
                placeholder="0x..."
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            {/* Record Type */}
            <div className="space-y-2">
              <Label htmlFor="recordType" className=" font-medium">
                Record Type *
              </Label>
              <Select value={recordType} onValueChange={setRecordType} required>
                <SelectTrigger className="focus-visible:ring-primary">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prescription">Prescription</SelectItem>
                  <SelectItem value="Lab Report">Lab Report</SelectItem>
                  <SelectItem value="Diagnosis">Diagnosis</SelectItem>
                  <SelectItem value="Imaging">
                    Imaging (X-Ray, MRI, etc.)
                  </SelectItem>
                  <SelectItem value="Surgery">Surgery Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Name */}
            <div className="space-y-2">
              <Label htmlFor="doctorName" className=" font-medium">
                Doctor Name *
              </Label>
              <Input
                id="doctorName"
                placeholder="Dr. ..."
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="focus-visible:ring-primary"
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="fileInput" className=" font-medium">
                Medical Record File *
              </Label>
              <Input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="h-16 cursor-pointer border-dashed border border-primary file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                required
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="metadata" className=" font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="metadata"
                rows={4}
                placeholder="Add any additional information about this record"
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                className="focus-visible:ring-primary h-32"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Uploading..." : "Upload Record to Blockchain"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Card>
  );
};

export default AddPatientRecord;
