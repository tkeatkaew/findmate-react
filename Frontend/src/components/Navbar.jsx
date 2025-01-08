import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppTheme from "../AppTheme";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("user");
  const user = isAuthenticated
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    handleClose();
    navigate("/");
  };

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
              หน้าหลัก
            </Button>
            <Button component={Link} to="/about" sx={{ textTransform: "none" }}>
              เกี่ยวกับเรา
            </Button>
            <Button
              component={Link}
              to="/donate"
              sx={{ textTransform: "none" }}
            >
              บริจาค
            </Button>
          </Stack>

          {/* Right: Profile/Login */}
          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">{user.name}</Typography>
              <Box
                onClick={handleClick}
                sx={{
                  cursor: "pointer",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    user.profile_picture ||
                    "http://localhost:3000/uploads/anonymous.jpg"
                  }
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  component={Link}
                  to="/edit-profile"
                  onClick={handleClose}
                >
                  แก้ไขโปรไฟล์
                </MenuItem>
                <MenuItem onClick={handleSignOut}>ออกจากระบบ</MenuItem>
              </Menu>
            </Box>
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
              เข้าสู่ระบบ
            </Button>
          )}
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Navbar;
