import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/discovery"); // Redirect logged-in user to Dashboard
    }
  }, [user, navigate]);

  return (
    <div className="container">
      <h1>Welcome to Home</h1>
      <p>Please login or register to continue.</p>
    </div>
  );
};

export default Home;
