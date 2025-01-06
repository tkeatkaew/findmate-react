import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";

import AppTheme from "../AppTheme"; // Import AppTheme for consistent styling
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

const PersonalityProfile = () => {
  const [traits, setTraits] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user_id } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/personalitytraits", { user_id, ...traits });
      alert("Traits saved successfully!");
      navigate("/discovery"); // Redirect to Discovery page after saving
    } catch (err) {
      alert("Error saving traits");
    }
  };

  const handleChange = (trait) => (e) => {
    setTraits({ ...traits, [trait]: e.target.value });
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          margin: "auto",
          marginTop: "10vh",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", fontWeight: 500 }}
          >
            Personality Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Sleeping Habit</FormLabel>
                <RadioGroup onChange={handleChange("sleeping")}>
                  <FormControlLabel
                    value="early"
                    control={<Radio />}
                    label="Early Riser"
                  />
                  <FormControlLabel
                    value="night"
                    control={<Radio />}
                    label="Night Owl"
                  />
                  <FormControlLabel
                    value="flexible"
                    control={<Radio />}
                    label="Flexible"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Cleanliness</FormLabel>
                <RadioGroup onChange={handleChange("cleanliness")}>
                  <FormControlLabel
                    value="very_clean"
                    control={<Radio />}
                    label="Very Clean"
                  />
                  <FormControlLabel
                    value="average"
                    control={<Radio />}
                    label="Average"
                  />
                  <FormControlLabel
                    value="messy"
                    control={<Radio />}
                    label="Messy"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Voice Use</FormLabel>
                <RadioGroup onChange={handleChange("voice_use")}>
                  <FormControlLabel
                    value="talkative"
                    control={<Radio />}
                    label="Talkative"
                  />
                  <FormControlLabel
                    value="moderate"
                    control={<Radio />}
                    label="Moderate"
                  />
                  <FormControlLabel
                    value="quiet"
                    control={<Radio />}
                    label="Quiet"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Nightlife Preference</FormLabel>
                <RadioGroup onChange={handleChange("nightlife")}>
                  <FormControlLabel
                    value="party"
                    control={<Radio />}
                    label="Party-goer"
                  />
                  <FormControlLabel
                    value="homebody"
                    control={<Radio />}
                    label="Homebody"
                  />
                  <FormControlLabel
                    value="occasional"
                    control={<Radio />}
                    label="Occasional"
                  />
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                Save & Proceed
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </AppTheme>
  );
};

export default PersonalityProfile;
