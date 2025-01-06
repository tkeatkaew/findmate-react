import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import AppTheme from "../AppTheme";

const Matched = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <AppTheme>
      <Box sx={{ display: "flex", minHeight: "90vh" }}>
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

        <Box sx={{ flex: 1, padding: "1rem" }}>
          <div className="container">
            {user && (
              <>
                <p>Welcome to the Matched page</p>
              </>
            )}
          </div>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Matched;
