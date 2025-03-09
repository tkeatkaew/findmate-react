import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import SvgIcon from "@mui/material/SvgIcon";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";

import AppTheme from "../AppTheme";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const role = "user";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/discovery");
    }
  }, [navigate]);

  // Password validation function
  const validatePassword = (password) => {
    // Check password length
    if (password.length < 8) {
      return "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว";
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว";
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว";
    }

    return "";
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      const error = validatePassword(newPassword);
      setPasswordError(error);
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setMessage(passwordValidationError);
      setAlertSeverity("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      setAlertSeverity("error");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
        role,
      });

      setMessage("กรุณาตรวจสอบรหัส OTP ในอีเมลของคุณ");
      setAlertSeverity("success");

      navigate("/verify-otp", {
        state: {
          registration_id: data.registration_id,
          email,
        },
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      setAlertSeverity("error");
      setIsLoading(false);
    }
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          margin: "auto",
          marginTop: "3rem",
          border: "1px solid #eee",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
            สมัครใช้งาน
          </Typography>

          {message && (
            <Alert severity={alertSeverity} onClose={() => setMessage("")}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                type="text"
                label="ยูสเซอร์เนม"
                placeholder="ยูสเซอร์เนมของคุณ"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                required
                type="email"
                label="อีเมล"
                placeholder="อีเมลของคุณ"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Box>
                <TextField
                  required
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="••••••••"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  error={!!passwordError}
                />
                {password && (
                  <FormHelperText
                    error={!!passwordError}
                    sx={{ marginLeft: "14px", marginTop: "4px" }}
                  >
                    {passwordError}
                  </FormHelperText>
                )}
              </Box>
              <TextField
                required
                type="password"
                label="ยืนยันรหัสผ่าน"
                placeholder="••••••••"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                error={confirmPassword && password !== confirmPassword}
                helperText={
                  confirmPassword && password !== confirmPassword
                    ? "รหัสผ่านไม่ตรงกัน"
                    : ""
                }
              />
              <FormHelperText
                sx={{
                  marginLeft: "14px",
                  marginTop: "4px",
                  color: "text.secondary",
                }}
              >
                รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร,
                ประกอบด้วยตัวอักษรพิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข และอักขระพิเศษ
              </FormHelperText>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  textTransform: "none",
                  height: "42px", // Fixed height to prevent button size change
                }}
              >
                {isLoading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <Typography>กำลังส่ง OTP...</Typography>
                  </Stack>
                ) : (
                  "สมัครใช้งาน"
                )}
              </Button>
              <Typography
                component="div"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                มีบัญชี Find Mate อยู่แล้ว?{" "}
                <Link href="/login" variant="body2">
                  เข้าสู่ระบบ
                </Link>
              </Typography>
            </Stack>
          </form>
        </Stack>
      </Box>
    </AppTheme>
  );
};

function GoogleIcon() {
  return (
    <SvgIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-3 0 262 262"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        />
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        />
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        />
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        />
      </svg>
    </SvgIcon>
  );
}

export default Register;
