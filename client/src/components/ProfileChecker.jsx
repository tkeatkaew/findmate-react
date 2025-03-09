import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";
import { checkProfileCompleteness } from "../utils/profileCheck";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Info } from "lucide-react";

// Modal component for information disclosure
const InfoModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: "15px",
          maxWidth: "500px",
          p: 1,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Info size={24} color="black" />
          <Typography variant="h6" component="span">
            ข้อมูลสำคัญ
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
          กรุณากรอกข้อมูลตามความเป็นจริง
          เพื่อที่ระบบจะสามารถคำนวณและแนะนำรูมเมทที่เหมาะสมกับคุณได้อย่างแม่นยำ
        </DialogContentText>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          ข้อมูลนี้จะถูกแสดงให้ผู้ใช้งานอื่นเห็นเพื่อประกอบการตัดสินใจในการเลือกรูมเมท
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{ textTransform: "none" }}
        >
          เข้าใจแล้ว
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProfileChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [showModal, setShowModal] = useState(false);

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
  };

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
    const user = JSON.parse(localStorage.getItem("user"));

    // No checking needed if not logged in, or if we're on an exempt page
    if (!user || exemptPaths.includes(location.pathname) || isAdminPath) {
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

          // Show the modal before redirecting
          setShowModal(true);

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
          }, 3000); // Increased time to allow user to read the modal
        }
      } catch (error) {
        console.error("Error checking profile:", error);

        // If we get a 404, it means the user hasn't created their profile yet
        if (error.response && error.response.status === 404) {
          setAlert({
            open: true,
            message: "กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน",
            severity: "warning",
          });

          // Show the modal before redirecting
          setShowModal(true);

          setTimeout(() => {
            navigate("/personalinfo", {
              state: { user_id: user.id, email: user.email },
            });
          }, 3000); // Increased time to allow user to read the modal
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

      {/* Information Modal */}
      <InfoModal open={showModal} onClose={handleModalClose} />
    </>
  );
};

export default ProfileChecker;
