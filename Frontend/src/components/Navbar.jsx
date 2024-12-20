import React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import AppTheme from "../AppTheme";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("user");

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          minWidth: "600px",
          padding: "0.5rem",
          paddingLeft: "1.5rem",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
          margin: "10px",
        }}
      >
        <Box
          component="nav"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Logo */}
          <Typography
            variant="p"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "inherit",
              flex: "0 1 auto",
            }}
          >
            Find Mate
          </Typography>

          {/* Center: Menu */}
          <Stack
            direction="row"
            spacing={4}
            sx={{
              flex: "1 1 auto",
              justifyContent: "center",
            }}
          >
            <Button component={Link} to="/" sx={{ textTransform: "none" }}>
              Home
            </Button>
            <Button component={Link} to="/about" sx={{ textTransform: "none" }}>
              About Us
            </Button>
            <Button
              component={Link}
              to="/donate"
              sx={{ textTransform: "none" }}
            >
              Donate
            </Button>
          </Stack>

          {/* Right: Login/Logout */}
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/"
              onClick={() => localStorage.removeItem("user")}
              sx={{
                flex: "0 1 auto",
                textTransform: "none",
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
              sx={{
                flex: "0 1 auto",
                textTransform: "none",
              }}
            >
              Sign in
            </Button>
          )}
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Navbar;
