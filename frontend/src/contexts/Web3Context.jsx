// src/contexts/Web3Context.js
import React, { useState, useEffect, createContext, useContext } from "react";
import Web3 from "web3";
import MedicalRecordsABI from "../../../medicalrecordcontract/build/contracts/MedicalRecords.json";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [medicalRecordsContract, setMedicalRecordsContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  // Initialize Web3
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        setLoading(true);

        // Modern dapp browsers...
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          try {
            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setWeb3(web3Instance);

            // Get accounts
            const accs = await web3Instance.eth.getAccounts();
            setAccounts(accs);
            setCurrentAccount(accs[0]);

            // Set up contract
            const networkId = await web3Instance.eth.net.getId();
            const deployedNetwork = MedicalRecordsABI.networks[networkId];

            if (deployedNetwork) {
              const medicalRecords = new web3Instance.eth.Contract(
                MedicalRecordsABI.abi,
                deployedNetwork.address
              );
              setMedicalRecordsContract(medicalRecords);

              // Check if current user is a doctor
              const doctorStatus = await medicalRecords.methods
                .isDoctor(accs[0])
                .call();
              setIsDoctor(doctorStatus);

              try {
                // Check if current user is admin
                const isCurrentUserAdmin = await medicalRecords.methods
                  .isAdmin(accs[0])
                  .call();
                setIsAdmin(isCurrentUserAdmin);
              } catch (error) {
                setIsAdmin(error);
              }

              // For patient, we'll need to check if they're registered
              try {
                await medicalRecords.methods
                  .getPatientDetails()
                  .call({ from: accs[0] });
                setIsPatient(true);
              } catch (err) {
                // If it fails, they're not registered as a patient
                setIsPatient(false);
              }
            } else {
              setError("Contract not deployed to detected network.");
            }
          } catch (error) {
            setError("User denied account access");
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          const web3Instance = new Web3(window.web3.currentProvider);
          setWeb3(web3Instance);

          // Rest of setup similar to above...
        }
        // Non-dapp browsers...
        else {
          setError("Non-Ethereum browser detected. Try installing MetaMask!");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        setCurrentAccount(accounts[0]);

        // Update role information
        if (medicalRecordsContract && accounts[0]) {
          const doctorStatus = await medicalRecordsContract.methods
            .isDoctor(accounts[0])
            .call();
          setIsDoctor(doctorStatus);

          // Check admin status
          const isCurrentUserAdmin = await medicalRecordsContract.methods
            .isAdmin(accounts[0])
            .call();
          setIsAdmin(isCurrentUserAdmin);

          try {
            await medicalRecordsContract.methods
              .getPatientDetails()
              .call({ from: accounts[0] });
            setIsPatient(true);
          } catch (err) {
            setIsPatient(false);
          }
        }
      });
    }
  }, [medicalRecordsContract]);

  const value = {
    web3,
    accounts,
    currentAccount,
    medicalRecordsContract,
    loading,
    error,
    isDoctor,
    isPatient,
    isAdmin,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
