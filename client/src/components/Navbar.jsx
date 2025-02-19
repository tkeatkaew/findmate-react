import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, X } from "lucide-react";
import AppTheme from "../AppTheme";
import axios from "../services/api";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isAuthenticated = !!localStorage.getItem("user");
  const user = isAuthenticated
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const response = await axios.get(`/personalinfo/${user.id}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, user?.id]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    handleClose();
    setMobileOpen(false);
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "หน้าหลัก", path: "/" },
    { text: "เกี่ยวกับเรา", path: "/about" },
  ];

  const getDisplayName = () => {
    if (userInfo?.nickname) {
      return userInfo.nickname;
    }
    return user?.name || "";
  };

  const getProfileImage = () => {
    if (user?.profile_picture) {
      return user.profile_picture;
    }
    // Use the local anonymous image as fallback
    return "/src/images/anonymous.jpg";
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Stack spacing={2}>
        {isAuthenticated && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              src={getProfileImage()}
              sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}
            />
            <Typography variant="subtitle1" sx={{ color: "black" }}>
              {getDisplayName()}
            </Typography>
          </Box>
        )}
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <ListItemText primary={item.text} sx={{ color: "black" }} />
            </ListItem>
          ))}
          {isAuthenticated && (
            <>
              <ListItem
                component={Link}
                to="/edit-profile"
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <ListItemText primary="แก้ไขโปรไฟล์" sx={{ color: "black" }} />
              </ListItem>
              <ListItem
                button
                onClick={handleSignOut}
                sx={{
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <ListItemText primary="ออกจากระบบ" sx={{ color: "black" }} />
              </ListItem>
            </>
          )}
          {!isAuthenticated && (
            <ListItem
              component={Link}
              to="/login"
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <ListItemText primary="เข้าสู่ระบบ" sx={{ color: "black" }} />
            </ListItem>
          )}
        </List>
      </Stack>
    </Box>
  );

  return (
    <AppTheme>
      <Box
        sx={{
          minWidth: "320px",
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
          {/* Logo */}
          <Typography
            variant="p"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "black",
              flex: "0 1 auto",
            }}
          >
            Find Mate
          </Typography>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              {mobileOpen ? <X /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  flex: "1 1 auto",
                  justifyContent: "center",
                }}
              >
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{ textTransform: "none", color: "black" }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Stack>

              {/* Desktop Auth Section */}
              {isAuthenticated ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body1" sx={{ color: "black" }}>
                    {getDisplayName()}
                  </Typography>
                  <Box
                    onClick={handleProfileClick}
                    sx={{
                      cursor: "pointer",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
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
                      sx={{ color: "black" }}
                    >
                      แก้ไขโปรไฟล์
                    </MenuItem>
                    <MenuItem onClick={handleSignOut} sx={{ color: "black" }}>
                      ออกจากระบบ
                    </MenuItem>
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
            </>
          )}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              borderRadius: "20px 0 0 20px",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </AppTheme>
  );
};

export default Navbar;
