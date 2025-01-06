import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import AppTheme from "../AppTheme";

const Discovery = () => {
  const [users, setUsers] = useState([]); // State to hold fetched user data
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch KNN data for the current user
  useEffect(() => {
    const fetchKnnData = async () => {
      try {
        const { data } = await axios.post("/knn", { user_id: user.id });
        setUsers(data.neighbors); // Set neighbors data in state
      } catch (err) {
        console.error("Error fetching KNN data", err);
      }
    };

    if (user) fetchKnnData();
  }, [user]);

  return (
    <AppTheme>
      <Box sx={{ display: "flex", minHeight: "90vh" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: "250px",
            padding: "0.5rem",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
            borderRadius: "20px",
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            sx={{
              flex: "1 1 auto",
              justifyContent: "top",
            }}
          >
            <Button
              component={Link}
              to="/discovery"
              sx={{ textTransform: "none" }}
            >
              Discover
            </Button>
            <Button component={Link} to="/liked" sx={{ textTransform: "none" }}>
              Liked
            </Button>
            <Button
              component={Link}
              to="/matched"
              sx={{ textTransform: "none" }}
            >
              Matched
            </Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, padding: "1rem" }}>
          <Typography variant="h4" gutterBottom>
            Discover Similar Users
          </Typography>
          {users.length > 0 ? (
            <Stack spacing={2}>
              {users.map((neighbor) => (
                <Paper
                  key={neighbor.user_id}
                  sx={{
                    padding: "1rem",
                    border: "1px solid #eee",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6">
                    {neighbor.traits.nickname} - {neighbor.similarity}% Similar
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sleeping Habit:</strong> {neighbor.traits.sleeping}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cleanliness:</strong> {neighbor.traits.cleanliness}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Voice Use:</strong> {neighbor.traits.voice_use}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nightlife Preference:</strong>{" "}
                    {neighbor.traits.nightlife}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body1">Loading similar users...</Typography>
          )}
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Discovery;
