import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="container">
      {user && (
        <>
          <h1>Hello, {user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Welcome to the dashboard page</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
