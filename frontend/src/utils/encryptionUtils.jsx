// src/utils/encryptionUtils.js
import CryptoJS from "crypto-js";

// Generate a secure encryption key from patient ID and additional secret
export const generateEncryptionKey = (patientId, personalSecret) => {
  return CryptoJS.SHA256(patientId + personalSecret).toString();
};
