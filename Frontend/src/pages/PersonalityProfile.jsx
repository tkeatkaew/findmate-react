import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";

import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
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
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "20px" }}>
      <Typography variant="h4">Personality Profile</Typography>
      <form onSubmit={handleSubmit}>
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
            <FormControlLabel value="messy" control={<Radio />} label="Messy" />
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
            <FormControlLabel value="quiet" control={<Radio />} label="Quiet" />
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

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button type="submit" variant="contained">
            Save & Proceed
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default PersonalityProfile;
