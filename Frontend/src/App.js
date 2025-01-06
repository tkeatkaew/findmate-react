import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Discovery from "./pages/Discovery";
import Liked from "./pages/Liked";
import Matched from "./pages/Matched";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PersonalInfo from "./pages/PersonalInfo";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="/matched" element={<Matched />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/personalInfo" element={<PersonalInfo />} />
      </Routes>
    </Router>
  );
};

export default App;
