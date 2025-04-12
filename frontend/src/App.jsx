// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";

// Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterDoctor from "./components/RegisterDoctor";
import RegisterPatient from "./components/RegisterPatient";
import AddPatientRecord from "./components/AddPatientRecord";
import PatientRecords from "./components/PatientRecords";
import HomePage from "./pages/HomePage";
import Topbar from "./components/layout/Topbar";

function App() {
  return (
    <Web3Provider>
      <Router>
        <Topbar></Topbar>
        <Navbar />

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />
          <Route path="/register-patient" element={<RegisterPatient />} />
          <Route path="/add-patient-record" element={<AddPatientRecord />} />
          <Route path="/records" element={<PatientRecords />} />

          {/* Redirecting to HomePage for Illigal Routes  */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
