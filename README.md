# HealthChain AI: Blockchain-based Patient Records with AI Disease Prediction and AI Assistance

## Problem Statement
"A significant number of medication errors in Nepalese hospitals is caused by manual processes and lack of digitalization put patient safety at serious risk. Out of 177 patients, 94% encountered medication errors and 32% of those errors turned harmful. Why are we still letting this happen?"

## Overview

HealthChain AI is a comprehensive healthcare platform that combines blockchain technology with artificial intelligence to revolutionize patient care. The system provides:

- *Secure Patient Records*: Store and share medical records using Ethereum blockchain and IPFS
- *AI-Powered Diagnostics*: Get disease predictions based on patient symptoms
- *Personalized Health Recommendations*: Receive diet plans, exercise routines, and medication recommendations
- *Consent Management*: Patients control who can access their medical information

## Technologies Used

### Blockchain Components
- *Ethereum*: Smart contracts for data access control and record management
- *IPFS*: Decentralized storage for medical files and reports
- *Truffle & Ganache*: Development and testing environment for smart contracts

### AI/ML Components
- *Flask API*: Backend for AI diagnostics and health recommendations
- *SVC Model*: Support Vector Classification for disease prediction
- *Natural Language Processing*: Symptom extraction from patient descriptions

### Frontend
- *React*: User interface for patients and healthcare providers
- *Web3.js*: Ethereum blockchain integration

## Features

### For Patients
- Register on the blockchain network
- Control access to personal health data
- Get AI-powered health recommendations
- Track medical history securely

### For Doctors
- Access patient records with consent
- Add diagnostic reports and prescriptions
- Use AI-based symptom analysis for decision support
- Track patient progress over time

## Architecture

The system consists of three main components:

1. *Blockchain Layer*:
   - Smart contracts for record management
   - IPFS for decentralized storage
   - Consent management system

2. *AI Layer*:
   - Flask API for processing healthcare data
   - ML models for symptom analysis and disease prediction
   - Recommendation engine for treatments and lifestyle changes

3. *Frontend Layer*:
   - React-based user interface
   - Web3 integration for blockchain interaction
   - Responsive design for multiple devices

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python 3.8+
- Metamask wallet
- Truffle and Ganache for local blockchain development

### Installation

1. Clone the repository:
bash
git clone https://github.com/AshayaSah/seven-chromosomes
2. Install frontend dependencies:
cd frontend
npm install
npm run dev


4. Install backend dependencies:
cd ../llm_flask_app
pip install -r requirements.txt


5. Setup local blockchain:
bash
cd ../medicalrecordcontract
npm install -g truffle
ganache-cli


6. Deploy smart contracts:
bash
truffle migrate --reset


### Running the Application

1. Start the Flask backend:
bash
cd flask_api
python app.py


2. Start the React frontend:
bash
cd frontend
npm start

3. Connect MetaMask to your local Ganache blockchain (typically at http://localhost:8545)

## AI Features

- *Disease Prediction*: SVC model trained on extensive symptom-disease datasets
- *Natural Language Understanding*: Extract symptoms from patient descriptions even with typos or incomplete information
- *Personalized Recommendations*: Generate customized diet plans and exercise routines based on diagnosis

## Future Enhancements

- Multi-language support for global accessibility
- Mobile application for on-the-go access
- Integration with existing electronic health record (EHR) systems
- Building upto the Health Standards

## Contributors

- Mirage Shretha - AI and ML
- Aashish - ML and Blockchain
- Ashaya Sah - Blcokchain and Frontend
- Rabindra - Backend

## Acknowledgments

- Thanks to Kaggle for providing the healthcare datasets used in training our AI models
- The Ethereum and IPFS communities for their excellent documentation and support
