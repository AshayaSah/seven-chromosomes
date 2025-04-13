// src/utils/ipfsUtils.js
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

// Connect to local IPFS node or Infura IPFS
const ipfs = create({
  host: "localhost",
  port: 5001,
  protocol: "http",
});

// For using Infura in Prod
// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
//   }
// });

export const uploadToIPFS = async (file) => {
  try {
    // Add data to IPFS
    const result = await ipfs.add(file);
    // console.log(result);
    return result.path; // This is the IPFS hash (CID)
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

// export const downloadFromIPFS = async (ipfsHash) => {
//   const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
//   window.open(ipfsUrl, "_blank");
//   let fileContent;

//   await fetch(ipfsUrl)
//     .then((res) => res.text()) // use .json() if it's JSON
//     .then((data) => {
//       fileContent = data;

//       // console.log("File content:", fileContent);
//     })
//     .catch((err) => console.error("Failed to fetch IPFS file:", err));

//   return fileContent;
// };

export const downloadFromIPFS = async (ipfsHash) => {
  const url = process.env.IPFS_URL;
  // console.log(url);
  const ipfsUrl = `${url}/${ipfsHash}`;

  try {
    const response = await fetch(ipfsUrl);
    if (!response.ok) throw new Error("Failed to fetch file");

    const blob = await response.blob(); // ⬅️ Use blob to handle binary data
    return blob; // You can now use this Blob however you want
  } catch (error) {
    console.error("Error downloading file from IPFS:", error);
    return null;
  }
};
