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

import AppTheme from "../AppTheme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/discovery"); // Redirect to discovery if logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts
    setError(""); // Clear any existing errors

    try {
      const { data } = await axios.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/discovery");
    } catch (err) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้องหรือบัญชีถูกระงับ");
    } finally {
      setIsLoading(false); // Set loading to false when submission completes
    }
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          minWidth: "400px",
          margin: "auto",
          marginTop: "3rem",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
        }}
      >
        <Stack spacing={2} useFlexGap>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
            เข้าสู่ระบบ
          </Typography>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} useFlexGap>
              <TextField
                required
                type="email"
                label="อีเมล"
                placeholder="อีเมลของคุณ"
                variant="outlined"
                fullWidth
                autoFocus
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                name="password"
                label="รหัสผ่าน"
                placeholder="••••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading} // Disable button while loading
                sx={{
                  textTransform: "none",
                  position: "relative", // Added for loading indicator positioning
                  minHeight: "36px", // Added to maintain consistent height
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
              <Typography
                component="div"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                ยังไม่มีบัญชี Find Mate?{" "}
                <span>
                  <Link href="/register" variant="body2">
                    สมัครเลย
                  </Link>
                </span>
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

export default Login;
