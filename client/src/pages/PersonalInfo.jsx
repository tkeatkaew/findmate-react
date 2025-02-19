import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";
import { uploadToCloudinary } from "../utils/cloudinary";
import { CheckCircle, XCircle } from "lucide-react";

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
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";

import AppTheme from "../AppTheme";

// Import provinces and universities data
import { provinces, universitiesByProvince } from "../data/universities";

const PersonalInfo = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [maritalstatus, setMaritalstatus] = useState("single");
  const [gender, setGender] = useState("male");
  const [lgbt, setLGBT] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [province, setProvince] = useState("");
  const [university, setUniversity] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [lineId, setLineId] = useState("");
  const [phone, setPhone] = useState("");
  const [dormName, setDormName] = useState("");
  const [vehicle, setVehicle] = useState("none");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [monthlyDormFee, setMonthlyDormFee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [contactError, setContactError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [socialContactHelperText, setSocialContactHelperText] = useState(
    "กรุณากรอกข้อมูลติดต่ออย่างน้อย 1 ช่องทาง"
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { user_id, email } = location.state || {};
  const fileInputRef = useRef(null);

  const hasAnySocialContact = () => {
    return Boolean(facebook || instagram || lineId || phone);
  };

  const handleSocialContactChange = (field, value) => {
    switch (field) {
      case "facebook":
        setFacebook(value);
        break;
      case "instagram":
        setInstagram(value);
        break;
      case "lineId":
        setLineId(value);
        break;
      case "phone":
        setPhone(value);
        break;
    }

    if (value || hasAnySocialContact()) {
      setContactError(false);
      setSocialContactHelperText("กรุณากรอกข้อมูลติดต่ออย่างน้อย 1 ช่องทาง");
    }
  };

  const handleProvinceChange = (event) => {
    const selectedProvince = event.target.value;
    setProvince(selectedProvince);
    setUniversity(""); // Reset university when province changes
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAlert({
        open: true,
        message: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น",
        severity: "error",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      setProfilePicture(cloudinaryUrl);

      setAlert({
        open: true,
        message: "อัปโหลดรูปสำเร็จ",
        severity: "success",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      setAlert({
        open: true,
        message: "อัปโหลดรูปไม่สำเร็จ",
        severity: "error",
      });
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!hasAnySocialContact()) {
      setContactError(true);
      setSocialContactHelperText("โปรดกรอกข้อมูลติดต่ออย่างน้อย 1 ช่องทาง");
      const socialSection = document.getElementById("social-contact-section");
      if (socialSection) {
        socialSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    try {
      setIsSubmitting(true);

      if (profilePicture) {
        await axios.post("/update-profile-picture", {
          user_id,
          profile_picture: profilePicture,
        });
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
        province,
        university,
        facebook,
        instagram,
        line_id: lineId,
        phone,
        dorm_name: dormName,
        vehicle,
        self_introduction: selfIntroduction,
        monthly_dorm_fee: monthlyDormFee || null,
      });

      setAlert({
        open: true,
        message: "บันทึกข้อมูลสำเร็จ",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/personalityprofile", { state: { user_id } });
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setAlert({
        open: true,
        message: "บันทึกข้อมูลไม่สำเร็จ",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "600px",
          minWidth: "400px",
          margin: "auto",
          marginTop: "10vh",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
        }}
      >
        <Stack spacing={1} useFlexGap>
          <Typography variant="h4">ประวัติส่วนตัว</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} useFlexGap>
              {/* Image Preview Section */}
              {previewUrl && (
                <Box
                  sx={{
                    position: "relative",
                    width: "fit-content",
                    margin: "0 auto",
                    mb: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Profile preview"
                    sx={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #eee",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setPreviewUrl("");
                      setProfilePicture(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      "&:hover": {
                        bgcolor: "background.paper",
                      },
                    }}
                  >
                    <XCircle size={24} />
                  </IconButton>
                </Box>
              )}

              <Button
                type="button"
                onClick={handleButtonClick}
                variant="outlined"
                disabled={isUploading}
                sx={{
                  position: "relative",
                  display: "block",
                  margin: "0 auto",
                }}
              >
                {isUploading ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-12px",
                      }}
                    />
                    <span style={{ opacity: 0 }}>เลือกรูปภาพโปรไฟล์</span>
                  </>
                ) : previewUrl ? (
                  "เปลี่ยนรูปภาพ"
                ) : (
                  "เลือกรูปภาพโปรไฟล์"
                )}
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />

              <TextField
                required
                type="text"
                label="ชื่อจริง"
                placeholder="กรอกชื่อจริง"
                variant="outlined"
                fullWidth
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <TextField
                required
                type="text"
                label="นามสกุล"
                placeholder="กรอกนามสกุล"
                variant="outlined"
                fullWidth
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <TextField
                required
                type="text"
                label="ชื่อเล่น"
                placeholder="กรอกชื่อเล่น"
                variant="outlined"
                fullWidth
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <TextField
                required
                type="number"
                label="อายุ"
                placeholder="กรอกอายุ"
                variant="outlined"
                fullWidth
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <FormControl fullWidth required>
                <InputLabel>สถานะ</InputLabel>
                <Select
                  value={maritalstatus}
                  onChange={(e) => setMaritalstatus(e.target.value)}
                >
                  <MenuItem value="single">โสด</MenuItem>
                  <MenuItem value="inrelationship">มีแฟน</MenuItem>
                  <MenuItem value="married">แต่งงานแล้ว</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>เพศ</InputLabel>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male">ชาย</MenuItem>
                  <MenuItem value="female">หญิง</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={lgbt}
                  onChange={(e) => setLGBT(e.target.checked)}
                />
                <Typography variant="body2">มีความหลากหลายทางเพศ</Typography>
              </Box>
              <FormControl fullWidth required>
                <InputLabel>จังหวัด</InputLabel>
                <Select value={province} onChange={handleProvinceChange}>
                  {provinces.map((prov) => (
                    <MenuItem key={prov} value={prov}>
                      {prov}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required disabled={!province}>
                <InputLabel>มหาวิทยาลัย</InputLabel>
                <Select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                >
                  {province &&
                    (universitiesByProvince[province] || []).map((uni) => (
                      <MenuItem key={uni} value={uni}>
                        {uni}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                type="text"
                label="ชื่อหอพัก"
                placeholder="ชื่อหอพักของคุณ"
                variant="outlined"
                fullWidth
                value={dormName}
                onChange={(e) => setDormName(e.target.value)}
              />

              <TextField
                type="number"
                label="ค่าหอพักต่อเดือน (ราคาเต็ม)"
                placeholder="กรอกค่าหอพักต่อเดือน"
                variant="outlined"
                fullWidth
                value={monthlyDormFee}
                onChange={(e) => setMonthlyDormFee(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">฿</InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth>
                <InputLabel>ยานพาหนะ</InputLabel>
                <Select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  label="ยานพาหนะ"
                >
                  <MenuItem value="none">ไม่มี</MenuItem>
                  <MenuItem value="motorbike">มอเตอร์ไซค์</MenuItem>
                  <MenuItem value="car">รถยนต์</MenuItem>
                  <MenuItem value="other">อื่นๆ</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="ข้อความเพิ่มเติม อธิบายตัวเองหรือสิ่งที่ต้องการ"
                placeholder="อธิบายตัวเองหรือสิ่งที่ต้องการ"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={selfIntroduction}
                onChange={(e) => setSelfIntroduction(e.target.value)}
              />

              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1 }}
                id="social-contact-section"
              >
                โซเชียลมีเดียและข้อมูลติดต่อ
              </Typography>

              <Typography
                variant="body2"
                color={contactError ? "error" : "text.secondary"}
                sx={{ mb: 2 }}
              >
                {socialContactHelperText}
              </Typography>

              <TextField
                type="text"
                label="Facebook"
                placeholder="ชื่อ Facebook ของคุณ"
                variant="outlined"
                fullWidth
                value={facebook}
                onChange={(e) =>
                  handleSocialContactChange("facebook", e.target.value)
                }
                error={formSubmitted && contactError}
                sx={{ mb: 2 }}
              />

              <TextField
                type="text"
                label="Instagram"
                placeholder="ชื่อ Instagram ของคุณ"
                variant="outlined"
                fullWidth
                value={instagram}
                onChange={(e) =>
                  handleSocialContactChange("instagram", e.target.value)
                }
                error={formSubmitted && contactError}
                sx={{ mb: 2 }}
              />

              <TextField
                type="text"
                label="Line ID"
                placeholder="Line ID"
                variant="outlined"
                fullWidth
                value={lineId}
                onChange={(e) =>
                  handleSocialContactChange("lineId", e.target.value)
                }
                error={formSubmitted && contactError}
                sx={{ mb: 2 }}
              />

              <TextField
                type="tel"
                label="หมายเลขโทรศัพท์"
                placeholder="หมายเลขโทรศัพท์ของคุณ"
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) =>
                  handleSocialContactChange("phone", e.target.value)
                }
                error={formSubmitted && contactError}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  position: "relative",
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-12px",
                      }}
                    />
                    <span style={{ opacity: 0 }}>บันทึก</span>
                  </>
                ) : (
                  "บันทึก"
                )}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={1000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
};

export default PersonalInfo;
