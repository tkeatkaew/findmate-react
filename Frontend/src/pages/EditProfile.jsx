import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import AppTheme from "../AppTheme";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState(0);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleDeleteAccountClick = () => {
    setDeletePassword("");
    setPasswordError("");
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletePassword("");
    setPasswordError("");
  };

  const handleDeleteAccount = async () => {
    try {
      // First verify the password
      const verifyResponse = await axios.post("/verify-password", {
        user_id: user.id,
        password: deletePassword,
      });

      if (verifyResponse.data.verified) {
        // If password is verified, proceed with account deletion
        await axios.delete(`/users/${user.id}`);
        localStorage.removeItem("user");
        showAlert("Account deleted successfully", "success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setPasswordError("Incorrect password");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setPasswordError("Error deleting account. Please try again.");
    }
  };

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstname: "",
    lastname: "",
    nickname: "",
    age: "",
    maritalstatus: "",
    gender: "",
    lgbt: false,
  });

  // Personality Traits State
  const [traits, setTraits] = useState({
    type: "",
    sleep: "",
    wake: "",
    clean: "",
    air_conditioner: "",
    drink: "",
    smoke: "",
    money: "",
    expense: "",
    pet: "",
    cook: "",
    loud: "",
    friend: "",
    religion: "",
    period: "",
  });

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Only fetch if data hasn't been fetched yet
    if (!dataFetched) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          // Fetch personal information
          const personalResponse = await axios.get(`/personalinfo/${user.id}`);
          if (personalResponse.data) {
            setPersonalInfo({
              ...personalResponse.data,
              lgbt: Boolean(personalResponse.data.lgbt),
            });
          }

          // Fetch personality traits
          const traitsResponse = await axios.get(
            `/personalitytraits/${user.id}`
          );
          if (traitsResponse.data) {
            setTraits(traitsResponse.data);
          }

          // Set profile picture preview if exists
          if (user.profile_picture) {
            setPreviewUrl(user.profile_picture);
          }

          setDataFetched(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          showAlert("Error loading profile data", "error");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, navigate, dataFetched]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTraitsChange = (trait) => (e) => {
    setTraits((prev) => ({
      ...prev,
      [trait]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload new profile picture if selected
      if (profilePicture) {
        const formData = new FormData();
        formData.append("profile_picture", profilePicture);
        formData.append("user_id", user.id);
        const uploadResponse = await axios.post(
          "/upload-profile-picture",
          formData
        );
        if (uploadResponse.data.profilePictureUrl) {
          // Update user in localStorage with new profile picture
          const updatedUser = {
            ...user,
            profile_picture: uploadResponse.data.profilePictureUrl,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      // Update personal information
      await axios.put(`/personalinfo/${user.id}`, {
        ...personalInfo,
        user_id: user.id,
      });

      // Update personality traits
      await axios.put(`/personalitytraits/${user.id}`, {
        ...traits,
        user_id: user.id,
      });

      showAlert("Profile updated successfully!", "success");

      // Redirect after successful update
      setTimeout(() => {
        navigate("/discovery");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("Error updating profile", "error");
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <AppTheme>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your profile...
          </Typography>
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "auto",
          marginTop: "2rem",
          marginBottom: "2rem",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Edit Profile
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          centered
          variant="fullWidth"
        >
          <Tab label="Personal Information" />
          <Tab label="Personality Traits" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {activeTab === 0 && (
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "150px",
                    height: "150px",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={previewUrl || "/uploads/anonymous.jpg"}
                    alt="Profile"
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <PhotoCamera />
                  </IconButton>
                </Box>
              </Box>

              <TextField
                name="firstname"
                label="First Name"
                value={personalInfo.firstname}
                onChange={handlePersonalInfoChange}
                fullWidth
                required
              />

              <TextField
                name="lastname"
                label="Last Name"
                value={personalInfo.lastname}
                onChange={handlePersonalInfoChange}
                fullWidth
                required
              />

              <TextField
                name="nickname"
                label="Nickname"
                value={personalInfo.nickname}
                onChange={handlePersonalInfoChange}
                fullWidth
                required
              />

              <TextField
                name="age"
                label="Age"
                type="number"
                value={personalInfo.age}
                onChange={handlePersonalInfoChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />

              <FormControl fullWidth required>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="maritalstatus"
                  value={personalInfo.maritalstatus}
                  onChange={handlePersonalInfoChange}
                  label="Marital Status"
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="inrelationship">In Relationship</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handlePersonalInfoChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    name="lgbt"
                    checked={personalInfo.lgbt}
                    onChange={handlePersonalInfoChange}
                  />
                }
                label="LGBT"
              />
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteAccountClick}
                  sx={{ textTransform: "none" }}
                >
                  Delete Account
                </Button>
              </Box>
            </Stack>
          )}

          {activeTab === 1 && (
            <Stack spacing={3}>
              {/* Personality Type */}
              <FormControl component="fieldset" required>
                <FormLabel>บุคลิกภาพของคุณเป็นแบบใด?</FormLabel>
                <RadioGroup
                  value={traits.type || ""}
                  onChange={handleTraitsChange("type")}
                >
                  <FormControlLabel
                    value="type_introvert"
                    control={<Radio />}
                    label="Introvert ชอบสังเกตและฟัง"
                  />
                  <FormControlLabel
                    value="type_extrovert"
                    control={<Radio />}
                    label="Extrovert ชอบพูดและเข้าสังคม"
                  />
                  <FormControlLabel
                    value="type_ambivert"
                    control={<Radio />}
                    label="Ambivert สมดุลระหว่างพูดและฟัง"
                  />
                </RadioGroup>
              </FormControl>

              {/* Sleep Time */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณมักเข้านอนเวลาใด?</FormLabel>
                <RadioGroup
                  value={traits.sleep || ""}
                  onChange={handleTraitsChange("sleep")}
                >
                  <FormControlLabel
                    value="sleep_before_midnight"
                    control={<Radio />}
                    label="ก่อนเที่ยงคืน"
                  />
                  <FormControlLabel
                    value="sleep_after_midnight"
                    control={<Radio />}
                    label="หลังเที่ยงคืน"
                  />
                </RadioGroup>
              </FormControl>

              {/* Wake Time */}
              <FormControl component="fieldset" required>
                <FormLabel>ช่วงเวลาที่คุณตื่นนอนเป็นประจำ?</FormLabel>
                <RadioGroup
                  value={traits.wake || ""}
                  onChange={handleTraitsChange("wake")}
                >
                  <FormControlLabel
                    value="wake_morning"
                    control={<Radio />}
                    label="ตื่นตอนเช้า"
                  />
                  <FormControlLabel
                    value="wake_noon"
                    control={<Radio />}
                    label="ตื่นตอนบ่าย"
                  />
                  <FormControlLabel
                    value="wake_evening"
                    control={<Radio />}
                    label="ตื่นตอนเย็น"
                  />
                </RadioGroup>
              </FormControl>

              {/* Cleanliness */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณทำความสะอาดพื้นที่ส่วนตัวบ่อยแค่ไหน?</FormLabel>
                <RadioGroup
                  value={traits.clean || ""}
                  onChange={handleTraitsChange("clean")}
                >
                  <FormControlLabel
                    value="clean_every_day"
                    control={<Radio />}
                    label="ทำความสะอาดทุกวัน"
                  />
                  <FormControlLabel
                    value="clean_every_other_day"
                    control={<Radio />}
                    label="ทำความสะอาดวันเว้นวัน"
                  />
                  <FormControlLabel
                    value="clean_once_a_week"
                    control={<Radio />}
                    label="ทำความสะอาดสัปดาห์ละครั้ง"
                  />
                  <FormControlLabel
                    value="clean_dont_really"
                    control={<Radio />}
                    label="ไม่ค่อยชอบทำความสะอาด"
                  />
                </RadioGroup>
              </FormControl>

              {/* Air Conditioner */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณเปิดเครื่องปรับอากาศบ่อยแค่ไหน?</FormLabel>
                <RadioGroup
                  value={traits.air_conditioner || ""}
                  onChange={handleTraitsChange("air_conditioner")}
                >
                  <FormControlLabel
                    value="ac_never"
                    control={<Radio />}
                    label="ไม่เปิดเลย"
                  />
                  <FormControlLabel
                    value="ac_only_sleep"
                    control={<Radio />}
                    label="เปิดเฉพาะเวลานอน"
                  />
                  <FormControlLabel
                    value="ac_only_hot"
                    control={<Radio />}
                    label="เปิดเฉพาะช่วงอากาศร้อน"
                  />
                  <FormControlLabel
                    value="ac_all_day"
                    control={<Radio />}
                    label="เปิดทั้งวัน"
                  />
                </RadioGroup>
              </FormControl>

              {/* Drinking */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?</FormLabel>
                <RadioGroup
                  value={traits.drink || ""}
                  onChange={handleTraitsChange("drink")}
                >
                  <FormControlLabel
                    value="drink_never"
                    control={<Radio />}
                    label="ไม่ดื่ม"
                  />
                  <FormControlLabel
                    value="drink_spacial"
                    control={<Radio />}
                    label="ดื่มเฉพาะโอกาสพิเศษ"
                  />
                  <FormControlLabel
                    value="drink_weekend"
                    control={<Radio />}
                    label="ดื่มช่วงสุดสัปดาห์"
                  />
                  <FormControlLabel
                    value="drink_always"
                    control={<Radio />}
                    label="ดื่มเป็นประจำ"
                  />
                </RadioGroup>
              </FormControl>

              {/* Smoking */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณสูบบุหรี่หรือไม่?</FormLabel>
                <RadioGroup
                  value={traits.smoke || ""}
                  onChange={handleTraitsChange("smoke")}
                >
                  <FormControlLabel
                    value="smoke_never"
                    control={<Radio />}
                    label="ไม่สูบ"
                  />
                  <FormControlLabel
                    value="smoke_spacial"
                    control={<Radio />}
                    label="สูบเฉพาะเวลาสังสรรค์"
                  />
                  <FormControlLabel
                    value="smoke_always"
                    control={<Radio />}
                    label="สูบเป็นประจำ"
                  />
                </RadioGroup>
              </FormControl>

              {/* Money Payment */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณจ่ายค่าหอพักตรงเวลาหรือไม่?</FormLabel>
                <RadioGroup
                  value={traits.money || ""}
                  onChange={handleTraitsChange("money")}
                >
                  <FormControlLabel
                    value="money_on_time"
                    control={<Radio />}
                    label="ตรงเวลาเสมอ"
                  />
                  <FormControlLabel
                    value="money_late"
                    control={<Radio />}
                    label="อาจคลาดเคลื่อนเล็กน้อย"
                  />
                </RadioGroup>
              </FormControl>

              {/* Expense Sharing */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณต้องการแบ่งค่าใช้จ่ายอย่างไร?</FormLabel>
                <RadioGroup
                  value={traits.expense || ""}
                  onChange={handleTraitsChange("expense")}
                >
                  <FormControlLabel
                    value="money_half"
                    control={<Radio />}
                    label="แบ่งเท่ากัน (ครึ่งต่อครึ่ง)"
                  />
                  <FormControlLabel
                    value="money_ratio"
                    control={<Radio />}
                    label="ตามสัดส่วนการใช้งาน (ใช้มากจ่ายมากกว่า)"
                  />
                </RadioGroup>
              </FormControl>

              {/* Pets */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณเลี้ยงสัตว์หรือไม่?</FormLabel>
                <RadioGroup
                  value={traits.pet || ""}
                  onChange={handleTraitsChange("pet")}
                >
                  <FormControlLabel
                    value="pet_dont_have"
                    control={<Radio />}
                    label="ไม่เลี้ยง"
                  />
                  <FormControlLabel
                    value="pet_have"
                    control={<Radio />}
                    label="เลี้ยง"
                  />
                </RadioGroup>
              </FormControl>

              {/* Cooking */}
              <FormControl component="fieldset" required>
                <FormLabel>
                  คุณยอมรับได้หรือไม่หากรูมเมททำอาหารมีกลิ่นแรง?
                </FormLabel>
                <RadioGroup
                  value={traits.cook || ""}
                  onChange={handleTraitsChange("cook")}
                >
                  <FormControlLabel
                    value="cook_ok"
                    control={<Radio />}
                    label="ยอมรับได้"
                  />
                  <FormControlLabel
                    value="cook_tell_first"
                    control={<Radio />}
                    label="ได้ถ้าบอกล่วงหน้า"
                  />
                  <FormControlLabel
                    value="cook_no"
                    control={<Radio />}
                    label="ไม่ยอมรับ"
                  />
                </RadioGroup>
              </FormControl>

              {/* Noise Level */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณใช้เสียงดังแค่ไหน?</FormLabel>
                <RadioGroup
                  value={traits.loud || ""}
                  onChange={handleTraitsChange("loud")}
                >
                  <FormControlLabel
                    value="loud_low"
                    control={<Radio />}
                    label="ไม่มาก"
                  />
                  <FormControlLabel
                    value="loud_medium"
                    control={<Radio />}
                    label="ปานกลาง"
                  />
                  <FormControlLabel
                    value="loud_high"
                    control={<Radio />}
                    label="มาก"
                  />
                </RadioGroup>
              </FormControl>

              {/* Friends Visiting */}
              <FormControl component="fieldset" required>
                <FormLabel>คุณโอเคกับการที่รูมเมทพาเพื่อนมาหรือไม่?</FormLabel>
                <RadioGroup
                  value={traits.friend || ""}
                  onChange={handleTraitsChange("friend")}
                >
                  <FormControlLabel
                    value="friend_ok"
                    control={<Radio />}
                    label="โอเค"
                  />
                  <FormControlLabel
                    value="friend_tell_first"
                    control={<Radio />}
                    label="ได้แต่ต้องบอกล่วงหน้า"
                  />
                  <FormControlLabel
                    value="friend_no"
                    control={<Radio />}
                    label="ไม่โอเค"
                  />
                </RadioGroup>
              </FormControl>

              {/* Religious Differences */}
              <FormControl component="fieldset" required>
                <FormLabel>
                  คุณสะดวกใจกับรูมเมทที่มีความเชื่อทางศาสนาแตกต่างจากคุณหรือไม่?
                </FormLabel>
                <RadioGroup
                  value={traits.religion || ""}
                  onChange={handleTraitsChange("religion")}
                >
                  <FormControlLabel
                    value="religion_ok"
                    control={<Radio />}
                    label="สะดวก"
                  />
                  <FormControlLabel
                    value="religion_no_affect"
                    control={<Radio />}
                    label="ได้ถ้าไม่กระทบกัน"
                  />
                  <FormControlLabel
                    value="religion_no"
                    control={<Radio />}
                    label="ไม่สะดวก"
                  />
                </RadioGroup>
              </FormControl>

              {/* Long-term Roommate */}
              <FormControl component="fieldset" required>
                <FormLabel>
                  คุณต้องการรูมเมทที่อยู่ร่วมกันระยะยาวหรือไม่?
                </FormLabel>
                <RadioGroup
                  value={traits.period || ""}
                  onChange={handleTraitsChange("period")}
                >
                  <FormControlLabel
                    value="period_long"
                    control={<Radio />}
                    label="ต้องการ"
                  />
                  <FormControlLabel
                    value="period_sometime"
                    control={<Radio />}
                    label="ขึ้นอยู่กับสถานการณ์"
                  />
                  <FormControlLabel
                    value="period_no_need"
                    control={<Radio />}
                    label="ไม่จำเป็น"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          )}

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Save Changes
            </Button>
          </Box>
        </form>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ color: "error.main" }}>Delete Account</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: "300px" }}>
            <Typography>
              This action cannot be undone. Please enter your password to
              confirm deletion.
            </Typography>
            <TextField
              type="password"
              label="Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={!deletePassword}
            sx={{ textTransform: "none" }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default EditProfile;
