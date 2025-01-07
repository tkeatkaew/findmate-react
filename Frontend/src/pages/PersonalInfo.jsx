import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";

import AppTheme from "../AppTheme";

const PersonalInfo = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [maritalstatus, setMaritalstatus] = useState("");
  const [gender, setGender] = useState("");
  const [lgbt, setLGBT] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user_id, email } = location.state || {};

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload profile picture if selected
      if (profilePicture) {
        const formData = new FormData();
        formData.append("profile_picture", profilePicture);
        formData.append("user_id", user_id);

        const { data } = await axios.post("/upload-profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Profile picture uploaded:", data.profilePictureUrl);
      }

      await axios.post("/personalinfo", {
        user_id,
        email,
        firstname,
        lastname,
        nickname,
        age,
        maritalstatus,
        gender,
        lgbt: lgbt ? 1 : 0,
      });
      alert("Personal information saved successfully!");
      navigate("/personalityprofile", { state: { user_id } }); // Redirect to PersonalityProfile with user_id
    } catch (err) {
      alert("Error updating personal info.");
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
          <Typography variant="h4">Personal Information</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} useFlexGap>
              <TextField
                required
                type="text"
                label="Firstname"
                placeholder="Enter your Firstname"
                variant="outlined"
                fullWidth
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
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="maritalstatus">Marital Status</InputLabel>
                <Select
                  required
                  value={maritalstatus}
                  onChange={(e) => setMaritalstatus(e.target.value)}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="inrelationship">In Relationship</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              <span>
                <Checkbox
                  checked={lgbt}
                  onChange={(e) => setLGBT(e.target.checked)}
                />
                <Typography variant="body2">LGBT</Typography>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: "1rem" }}
              />
              <Button type="submit" variant="contained" fullWidth>
                Save & Continue
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </AppTheme>
  );
};

export default PersonalInfo;
