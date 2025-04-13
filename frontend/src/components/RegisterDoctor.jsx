import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RegisterDoctor = () => {
  const { currentAccount, medicalRecordsContract, isAdmin } = useWeb3();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [currentAccount, isAdmin, navigate]);

  const [doctorAddress, setDoctorAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

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
    <Card className="mt-4 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center pb-2 border-b">
          Doctor Registration
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          As the admin, you can register new doctors to grant them access to add
          and view medical records.
        </p>
      </CardHeader>

      <CardContent>
        {message.content && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctorAddress">Doctor's Ethereum Address *</Label>
            <Input
              id="doctorAddress"
              placeholder="0x..."
              value={doctorAddress}
              onChange={(e) => setDoctorAddress(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the Ethereum address of the doctor you want to register.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Doctor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterDoctor;
