import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";
import { uploadToCloudinary } from "../utils/cloudinary";
import { CheckCircle, XCircle } from "lucide-react";
//import RequiredInfoBanner from "../components/RequiredInfoBanner";

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
import Avatar from "@mui/material/Avatar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import defaultAvatar from "../images/anonymous.jpg";

import AppTheme from "../AppTheme";

const provinces = ["กรุงเทพมหานคร", "กระบี่"];

// University data by province
const universitiesByProvince = {
  กระบี่: ["มหาวิทยาลัยการกีฬาแห่งชาติ วิทยาเขตกระบี่"],
  กรุงเทพมหานคร: [
    "จุฬาลงกรณ์มหาวิทยาลัย",
    "มหาวิทยาลัยเกษตรศาสตร์",
    "มหาวิทยาลัยเกษตรศาสตร์ บางเขน",
    "มหาวิทยาลัยธรรมศาสตร์",
    "มหาวิทยาลัยมหิดล",
    "มหาวิทยาลัยรามคำแหง",
    "มหาวิทยาลัยรามคำแหง วิทยาเขตบางนา",
    "มหาวิทยาลัยศิลปากร",
    "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    "สถาบันบัณฑิตพัฒนบริหารศาสตร์",
    "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
    "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี วิทยาเขตบางขุนเทียน",
    "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
    "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
    "มหาวิทยาลัยศรีปทุม",
    "มหาวิทยาลัยหอการค้าไทย",
    "มหาวิทยาลัยเกริก",
    "มหาวิทยาลัยเซนต์จอห์น",
    "มหาวิทยาลัยเทคโนโลยีมหานคร",
    "มหาวิทยาลัยอัสสัมชัญ",
    "มหาวิทยาลัยธนบุรี",
    "มหาวิทยาลัยธุรกิจบัณฑิตย์",
    "มหาวิทยาลัยเอเชียอาคเนย์",
    "มหาวิทยาลัยกรุงเทพธนบุรี",
    "วิทยาลัยเซนต์หลุยส์",
    "มหาวิทยาลัยเซาธ์อีสท์บางกอก",
    "วิทยาลัยดุสิตธานี",
    "วิทยาลัยทองสุข",
    "มหาวิทยาลัยนอร์ทกรุงเทพ",
    "มหาวิทยาลัยนานาชาติเอเชีย-แปซิฟิก วิทยาเขตกรุงเทพฯ",
    "สถาบันรัชต์ภาคย์",
    "มหาวิทยาลัยรัตนบัณฑิต",
    "มหาวิทยาลัยราชภัฏธนบุรี",
    "มหาวิทยาลัยราชภัฏพระนคร",
    "มหาวิทยาลัยสวนดุสิต",
    "มหาวิทยาลัยราชภัฏสวนสุนันทา",
    "มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา",
    "มหาวิทยาลัยราชภัฏจันทรเกษม",
    "มหาวิทยาลัยเกษมบัณฑิต",
    "มหาวิทยาลัยเกษมบัณฑิต พัฒนาการ",
    "มหาวิทยาลัยสยาม",
    "มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย",
    "มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย วิทยาลัยสมทบ",
    "มหาวิทยาลัยมหามกุฏราชวิทยาลัย",
    "สถาบันเทคโนโลยีปทุมวัน",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ วิทยาเขตเทคนิคกรุงเทพฯ",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ วิทยาเขตบพิตรพิมุข มหาเมฆ",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ วิทยาเขตพระนครใต้",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก วิทยาเขตจักรพงษภูนารถ",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก วิทยาเขตอุเทนถวาย",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร ศูนย์เทเวศร์",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร ศูนย์โชติเวช",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร ศูนย์พณิชยการพระนคร",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร ศูนย์พระนครเหนือ",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์ วิทยาเขตเพาะช่าง",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์ วิทยาเขตบพิตรพิมุข จักรวรรดิ",
    "สถาบันวิทยาลัยชุมชน",
    "โรงเรียนนายเรืออากาศนวมินทกษัตริยาธิราช",
    "วิทยาลัยแพทยศาสตร์พระมงกุฎเกล้า",
    "วิทยาลัยพยาบาลกองทัพบก",
    "วิทยาลัยพยาบาลกองทัพเรือ",
    "วิทยาลัยพยาบาลทหารอากาศ",
    "วิทยาลัยพยาบาลตำรวจ",
    "สถาบันพระบรมราชชนก",
    "วิทยาลัยพยาบาลบรมราชชนนี กรุงเทพ",
    "วิทยาลัยพยาบาลบรมราชชนนี นพรัตน์วชิระ",
    "สถาบันการพยาบาลศรีสวรินทิราสภากาชาดไทย",
    "สถาบันบัณฑิตพัฒนศิลป์",
    "มหาวิทยาลัยการกีฬาแห่งชาติ วิทยาเขตกรุงเทพ",
    "สถาบันการบินพลเรือน",
    "มหาวิทยาลัยกรุงเทพสุวรรณภูมิ",
    "วิทยาลัยเทคโนโลยีสยาม",
    "ราชวิทยาลัยจุฬาภรณ์",
    "สถาบันเทคโนโลยีไทย-ญี่ปุ่น",
    "สถาบันอาศรมศิลป์",
    "สถาบันบัณฑิตศึกษาจุฬาภรณ์",
    "สถาบันการจัดการปัญญาภิวัฒน์",
    "สถาบันดนตรีกัลยาณิวัฒนา",
    "มหาวิทยาลัยนวมินทราธิราช",
    "สถาบันเทคโนโลยีจิตรลดา",
    "โรงเรียนเสนาธิการทหารบก",
    "วิทยาลัยนานาชาติราฟเฟิลส์",
  ],
};

const PersonalInfo = () => {
  // State for form fields
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

  // Other state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
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
  const [ageError, setAgeError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Get user ID and email, prioritizing location state but falling back to localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // First try to get from location state (from redirects)
    let id = location.state?.user_id;
    let email = location.state?.email;

    // If not available in location state, use localStorage as fallback
    if (!id && storedUser) {
      id = storedUser.id;
      email = storedUser.email;
    }

    // If we still don't have a user ID, redirect to login
    if (!id) {
      navigate("/login");
      return;
    }

    setUserId(id);
    setUserEmail(email);
  }, [location.state, navigate]);

  // Fetch existing data once we have a userId
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Try to get existing personal info from database
        try {
          const response = await axios.get(`/personalinfo/${userId}`);
          const data = response.data;

          if (data) {
            // Pre-fill form with existing data
            setFirstname(data.firstname || "");
            setLastname(data.lastname || "");
            setNickname(data.nickname || "");
            setAge(data.age?.toString() || "");
            setMaritalstatus(data.maritalstatus || "single");
            setGender(data.gender || "male");
            setLGBT(Boolean(data.lgbt));
            setProvince(data.province || "");
            setUniversity(data.university || "");
            setFacebook(data.facebook || "");
            setInstagram(data.instagram || "");
            setLineId(data.line_id || "");
            setPhone(data.phone || "");
            setDormName(data.dorm_name || "");
            setVehicle(data.vehicle || "none");
            setSelfIntroduction(data.self_introduction || "");
            setMonthlyDormFee(data.monthly_dorm_fee?.toString() || "");
          }
        } catch (error) {
          // It's okay if there's no existing data
          console.log(
            "No existing personal info found, starting with a blank form"
          );
        }

        // Try to get user profile picture
        try {
          const userResponse = await axios.get(`/admin/users/${userId}`);
          if (userResponse.data.profile_picture) {
            setPreviewUrl(userResponse.data.profile_picture);
          }
        } catch (error) {
          console.log("Could not fetch profile picture");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert("Error loading user data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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

    const ageValidationError = validateAge(age);
    if (ageValidationError) {
      setAgeError(ageValidationError);
      return;
    }

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

      if (profilePicture && userId) {
        await axios.post("/update-profile-picture", {
          user_id: userId,
          profile_picture: profilePicture,
        });

        // Update local storage with new profile picture
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.profile_picture = profilePicture;
          localStorage.setItem("user", JSON.stringify(user));
        }
      }

      await axios.post("/personalinfo", {
        user_id: userId,
        email: userEmail,
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
        navigate("/personalityprofile", { state: { user_id: userId } });
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

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      return "กรุณากรอกอายุเป็นตัวเลข";
    }
    if (ageNum < 15) {
      return "อายุต้องมากกว่า 15 ปี";
    }
    if (ageNum > 80) {
      return "กรุณาตรวจสอบอายุอีกครั้ง";
    }
    return "";
  };

  const handleAgeChange = (e) => {
    const newAge = e.target.value;
    setAge(newAge);
    const error = validateAge(newAge);
    setAgeError(error);
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
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
            กำลังโหลดข้อมูล...
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
          maxWidth: "600px",
          minWidth: "400px",
          margin: "auto",
          marginTop: "2rem",
          marginBottom: "2rem",
          border: "1px solid #eee",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px",
        }}
      >
        <Stack spacing={1} useFlexGap>
          <Typography variant="h4">ประวัติส่วนตัว</Typography>

          {/* Add the RequiredInfoBanner here */}
          <RequiredInfoBanner type="personal" />

          <form onSubmit={handleSubmit}>
            <Stack spacing={2} useFlexGap>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "150px",
                    height: "150px",
                  }}
                >
                  <Avatar
                    src={previewUrl || defaultAvatar}
                    alt="Profile"
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              </Box>

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
                onChange={handleAgeChange}
                error={!!ageError}
                helperText={ageError}
                inputProps={{
                  min: 15,
                  max: 80,
                }}
              />
              <FormControl fullWidth required>
                <InputLabel>สถานะ</InputLabel>
                <Select
                  value={maritalstatus}
                  onChange={(e) => setMaritalstatus(e.target.value)}
                  label="Marital Status"
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
                  label="Gender"
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
                <Select
                  value={province}
                  onChange={handleProvinceChange}
                  label="Province"
                >
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
                  label="University"
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
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  position: "relative",
                  mt: 2,
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
