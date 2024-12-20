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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";

import AppTheme from "../AppTheme";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [maritalstatus, setMaritalstatus] = useState("");
  const [gender, setGender] = useState("");
  const [lgbt, setLGBT] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const navigate = useNavigate();
  const role = "user";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard"); // Redirect to Dashboard if logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/personalinfo", {
        firstname,
        lastname,
        nickname,
        age,
      });
      console.log(data);
      setMessage("Registration successful!");
    } catch (err) {
      setMessage("Error registering user.");
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
          marginTop: "10vh",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
        }}
      >
        <Stack spacing={1} useFlexGap>
          <Typography component="div" variant="body2"></Typography>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
            Personal Infomation
          </Typography>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} useFlexGap>
              <TextField
                required
                type="text"
                label="Firstname"
                placeholder="Enter your Firstname"
                variant="outlined"
                fullWidth
                autoFocus
                id="firstname"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <TextField
                required
                type="text"
                label="Lastname"
                placeholder="Enter your Lastname"
                variant="outlined"
                fullWidth
                autoFocus
                id="lastname"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <TextField
                required
                type="text"
                label="Nickname"
                placeholder="Enter your Nickname"
                variant="outlined"
                fullWidth
                autoFocus
                id="nickname"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <TextField
                required
                type="number"
                label="Age"
                placeholder="Enter your Age"
                variant="outlined"
                fullWidth
                autoFocus
                id="age"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="maritalstatus">Marital Status</InputLabel>
                <Select
                  required
                  label="Marital Status"
                  placeholder="Enter your Marital Status"
                  variant="outlined"
                  labelId="maritalstatus"
                  fullWidth
                  autoFocus
                  id="maritalstatus"
                  value={maritalstatus}
                  onChange={(e) => setMaritalstatus(e.target.value)}
                >
                  <MenuItem value={"single"}>Single</MenuItem>
                  <MenuItem value={"inrelationship"}>In Relationship</MenuItem>
                  <MenuItem value={"married"}>Married</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  required
                  label="Gender"
                  placeholder="Gender"
                  variant="outlined"
                  labelId="gender"
                  fullWidth
                  autoFocus
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                </Select>
              </FormControl>
              <Checkbox
                checked={lgbt}
                onChange={(e) => setLGBT(e.target.value)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Next
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </AppTheme>
  );
};

export default Register;
