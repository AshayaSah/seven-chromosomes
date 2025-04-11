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

function App() {
  return (
    <Web3Provider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
