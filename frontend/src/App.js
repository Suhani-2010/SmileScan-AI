// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Report from "./report";
import About from "./About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report-generator" element={<Report />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
