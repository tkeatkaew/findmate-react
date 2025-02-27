import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";
import authService from "../services/authService";
import { checkProfileCompleteness } from "../utils/profileCheck";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ProfileChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Exempt these paths from checking - otherwise we'd create infinite redirects
  const exemptPaths = [
    "/login",
    "/register",
    "/verify-otp",
    "/personalinfo",
    "/personalityprofile",
    "/",
    "/about",
  ];

  // Admin paths are also exempt
  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Initialize authentication from token if available
    authService.initializeAuth();

    // Check if user is authenticated using JWT
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();

    // No checking needed if not logged in, or if we're on an exempt page
    if (
      !isAuthenticated ||
      !user ||
      exemptPaths.includes(location.pathname) ||
      isAdminPath
    ) {
      setIsChecking(false);
      return;
    }

    const checkProfile = async () => {
      try {
        // Get user's personal info and traits
        const [personalInfoRes, traitsRes] = await Promise.all([
          axios.get(`/personalinfo/${user.id}`),
          axios.get(`/personalitytraits/${user.id}`),
        ]);

        const personalInfo = personalInfoRes.data;
        const traits = traitsRes.data;

        // Check if profile is complete
        const { isComplete, hasIncompleteInfo, hasIncompleteTraits } =
          checkProfileCompleteness(personalInfo, traits);

        if (!isComplete) {
          setAlert({
            open: true,
            message: "กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน",
            severity: "warning",
          });

          // Give user time to see the message before redirect
          setTimeout(() => {
            // Redirect to the appropriate page
            if (hasIncompleteInfo) {
              navigate("/personalinfo", {
                state: { user_id: user.id, email: user.email },
              });
            } else if (hasIncompleteTraits) {
              navigate("/personalityprofile", { state: { user_id: user.id } });
            }
          }, 1500);
        }
      } catch (error) {
        console.error("Error checking profile:", error);

        // If we get a 404, it means the user hasn't created their profile yet
        if (error.response && error.response.status === 404) {
          setAlert({
            open: true,
            message: "กรุณากรอกข้อมูลส่วนตัว",
            severity: "warning",
          });

          setTimeout(() => {
            navigate("/personalinfo", {
              state: { user_id: user.id, email: user.email },
            });
          }, 1500);
        }

        // If we get a 401 or 403, the token is invalid or expired
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Force logout and redirect to login
          authService.logout();
          navigate("/login");
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [navigate, location.pathname]);

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  if (isChecking && !exemptPaths.includes(location.pathname) && !isAdminPath) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">กำลังตรวจสอบข้อมูลผู้ใช้...</Typography>
      </Box>
    );
  }

  return (
    <>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileChecker;
