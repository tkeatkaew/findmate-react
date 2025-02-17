import React, { useEffect, useState } from "react";
import axios from "../services/api";
import AppTheme from "../AppTheme";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Filter,
  X,
  Search,
  Heart,
  UserPlus2,
  Bug,
  MessageSquarePlus,
} from "lucide-react";
import { useTheme, useMediaQuery } from "@mui/material";

const Liked = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "ค้นหารูมเมท", icon: <Search size={20} />, path: "/discovery" },
    { text: "ชอบ", icon: <Heart size={20} />, path: "/liked" },
    { text: "จับคู่", icon: <UserPlus2 size={20} />, path: "/matched" },
  ];

  const footerItems = [
    {
      text: "แจ้งปัญหาการใช้งาน",
      icon: <Bug size={20} />,
      onClick: () => {
        setIsSuggestion(false);
        setSystemReportDialog(true);
      },
      color: "error",
    },
    {
      text: "ข้อเสนอแนะ",
      icon: <MessageSquarePlus size={20} />,
      onClick: () => {
        setIsSuggestion(true);
        setSystemReportDialog(true);
      },
    },
  ];

  const [isSuggestion, setIsSuggestion] = useState(false);
  const [systemReportDialog, setSystemReportDialog] = useState(false);
  const [systemReportType, setSystemReportType] = useState("");
  const [systemDescription, setSystemDescription] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportImage, setReportImage] = useState(null);
  const [reportImagePreview, setReportImagePreview] = useState("");

  const [likedUsers, setLikedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserTraits, setCurrentUserTraits] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSystemReport = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("type", systemReportType);
      formData.append("description", systemDescription);
      if (reportImage) {
        formData.append("image", reportImage);
      }
      if (isSuggestion) {
        // If it’s just a suggestion
        await axios.post("/suggestions", {
          user_id: user.id,
          content: systemDescription,
        });
      } else {
        // If it’s a system bug report
        await axios.post("/reports/system", formData);
      }
      showAlert(
        isSuggestion ? "ส่งข้อเสนอแนะเรียบร้อยแล้ว" : "ส่งรายงานเรียบร้อยแล้ว",
        "success"
      );
      setSystemReportDialog(false);
      setSystemReportType("");
      setSystemDescription("");
      setReportImage(null);
      setReportImagePreview("");
      setIsSuggestion(false);
    } catch (err) {
      showAlert("เกิดข้อผิดพลาดในการส่งข้อมูล", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportImage(file);
      setReportImagePreview(URL.createObjectURL(file));
    }
  };

  // Label and value mappings for user traits
  const labelMapping = {
    type: "บุคลิกภาพ",
    sleep: "เวลานอน",
    wake: "เวลาตื่น",
    clean: "ความสะอาด",
    air_conditioner: "เครื่องปรับอากาศ",
    drink: "แอลกอฮอล์",
    smoke: "บุหรี่",
    money: "จ่ายค่าหอตรงเวลา",
    expense: "แบ่งค่าใช้จ่าย",
    pet: "เลี้ยงสัตว์",
    cook: "ทำอาหาร",
    loud: "การใช้เสียง",
    friend: "พาเพื่อนมาห้อง",
    religion: "เชื่อทางศาสนาต่างกัน",
    period: "รูมเมทระยะยาว",
  };

  const valueMapping = {
    type_introvert: "Introvert",
    type_extrovert: "Extrovert",
    type_ambivert: "Ambivert",
    sleep_before_midnight: "ก่อนเที่ยงคืน",
    sleep_after_midnight: "หลังเที่ยงคืน",
    wake_morning: "ตื่นตอนเช้า",
    wake_noon: "ตื่นตอนบ่าย",
    wake_evening: "ตื่นตอนเย็น",
    clean_every_day: "ทำความสะอาดทุกวัน",
    clean_every_other_day: "ทำความสะอาดวันเว้นวัน",
    clean_once_a_week: "ทำความสะอาดสัปดาห์ละครั้ง",
    clean_dont_really: "ไม่ค่อยชอบทำความสะอาด",
    ac_never: "ไม่เปิดเลย",
    ac_only_sleep: "เปิดเฉพาะเวลานอน",
    ac_only_hot: "เปิดเฉพาะช่วงอากาศร้อน",
    ac_all_day: "เปิดทั้งวัน",
    drink_never: "ไม่ดื่ม",
    drink_spacial: "ดื่มเฉพาะโอกาสพิเศษ",
    drink_weekend: "ดื่มช่วงสุดสัปดาห์",
    drink_always: "ดื่มเป็นประจำ",
    smoke_never: "ไม่สูบ",
    smoke_spacial: "สูบเฉพาะเวลาสังสรรค์",
    smoke_always: "สูบเป็นประจำ",
    money_on_time: "ตรงเวลาเสมอ",
    money_late: "อาจคลาดเคลื่อนเล็กน้อย",
    money_half: "แบ่งเท่ากัน",
    money_ratio: "ตามสัดส่วนการใช้งาน",
    pet_dont_have: "ไม่เลี้ยง",
    pet_have: "เลี้ยง",
    cook_ok: "ยอมรับได้",
    cook_tell_first: "ได้ถ้าบอกล่วงหน้า",
    cook_no: "ไม่ยอมรับ",
    loud_low: "ไม่มาก",
    loud_medium: "ปานกลาง",
    loud_high: "มาก",
    friend_ok: "โอเค",
    friend_tell_first: "ได้แต่ต้องบอกล่วงหน้า",
    friend_no: "ไม่โอเค",
    religion_ok: "สะดวก",
    religion_no_affect: "ได้ถ้าไม่กระทบกัน",
    religion_no: "ไม่สะดวก",
    period_long: "ต้องการ",
    period_sometime: "ขึ้นอยู่กับสถานการณ์",
    period_no_need: "ไม่จำเป็น",
  };

  const maritalStatusMapping = {
    single: "โสด",
    inrelationship: "มีแฟน",
    married: "แต่งงานแล้ว",
  };

  const genderMapping = {
    male: "ชาย",
    female: "หญิง",
  };

  const vehicleMapping = {
    none: "ไม่มี",
    motorbike: "มอเตอร์ไซค์",
    car: "รถยนต์",
    other: "อื่นๆ",
  };

  // Categories and weights for matching calculation
  const traitCategories = {
    type: ["type_introvert", "type_ambivert", "type_extrovert"],
    sleep: ["sleep_before_midnight", "sleep_after_midnight"],
    wake: ["wake_morning", "wake_noon", "wake_evening"],
    clean: [
      "clean_every_day",
      "clean_every_other_day",
      "clean_once_a_week",
      "clean_dont_really",
    ],
    air_conditioner: ["ac_never", "ac_only_sleep", "ac_only_hot", "ac_all_day"],
    drink: ["drink_never", "drink_spacial", "drink_weekend", "drink_always"],
    smoke: ["smoke_never", "smoke_spacial", "smoke_always"],
    money: ["money_on_time", "money_late"],
    expense: ["money_half", "money_ratio"],
    pet: ["pet_dont_have", "pet_have"],
    cook: ["cook_ok", "cook_tell_first", "cook_no"],
    loud: ["loud_low", "loud_medium", "loud_high"],
    friend: ["friend_ok", "friend_tell_first", "friend_no"],
    religion: ["religion_ok", "religion_no_affect", "religion_no"],
    period: ["period_long", "period_sometime", "period_no_need"],
  };

  const weights = {
    smoke: 2.0,
    drink: 1.8,
    sleep: 1.5,
    money: 1.5,
    expense: 1.5,
    pet: 1.2,
    religion: 1.2,
    loud: 1.2,
    friend: 1.1,
    cook: 1.0,
    clean: 0.8,
  };

  useEffect(() => {
    // if (!user) {
    //   navigate("/login");
    //   return;
    // }

    if (1 == 0) {
      navigate("/login");
      return;
    }

    if (!dataFetched) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [traitsResponse, likedUsersResponse] = await Promise.all([
            axios.get(`/personalitytraits/${user.id}`),
            axios.get("/liked", { params: { user_id: user.id } }),
          ]);

          const currentTraits = traitsResponse.data;
          setCurrentUserTraits(currentTraits);

          // Calculate similarity for each liked user
          const likedUsersWithSimilarity = likedUsersResponse.data.map(
            (likedUser) => ({
              ...likedUser,
              similarity: calculateSimilarity(likedUser, currentTraits),
            })
          );

          // Sort by similarity
          const sortedLikedUsers = likedUsersWithSimilarity.sort(
            (a, b) => b.similarity - a.similarity
          );

          setLikedUsers(sortedLikedUsers);
          setDataFetched(true);
        } catch (err) {
          console.error("Error fetching data:", err);
          showAlert("Error fetching data", "error");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user, navigate, dataFetched]);

  const calculateSimilarity = (userTraits, currentTraits) => {
    const encodeTrait = (trait, categories) => {
      const index = categories.indexOf(trait);
      if (index === -1) return new Array(categories.length).fill(0);
      return categories.map((_, i) => (i === index ? 1 : 0));
    };

    const encodeUserTraits = (traits) => {
      return Object.keys(traitCategories).flatMap((trait) => {
        const encoded = encodeTrait(traits[trait], traitCategories[trait]);
        return encoded.map((value) => value * (weights[trait] || 1));
      });
    };

    const cosineSimilarity = (vectorA, vectorB) => {
      let dotProduct = 0,
        magnitudeA = 0,
        magnitudeB = 0;

      vectorA.forEach((a, i) => {
        dotProduct += a * vectorB[i];
        magnitudeA += a * a;
        magnitudeB += vectorB[i] * vectorB[i];
      });

      const similarity =
        magnitudeA && magnitudeB
          ? (dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))) * 100
          : 0;
      return parseFloat(similarity.toFixed(2));
    };

    const encodedUserTraits = encodeUserTraits(userTraits);
    const encodedCurrentTraits = encodeUserTraits(currentTraits);

    return cosineSimilarity(encodedUserTraits, encodedCurrentTraits);
  };

  const handleLike = async (targetUserId, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedUser(null);
    try {
      await axios.post("/like", {
        user_id: user.id,
        liked_user_id: targetUserId,
        action: "unlike",
      });

      setLikedUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== targetUserId)
      );
      showAlert("ถอนถูกใจสำเร็จ!", "success");
    } catch (err) {
      console.error("Error handling like:", err);
      showAlert("Error processing your request", "error");
    }
  };

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <AppTheme>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "90vh",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="h6">กำลังโหลดข้อมูล...</Typography>
        </Box>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <Box sx={{ display: "flex", minHeight: "90vh" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: isMobile ? "auto" : "200px",
            padding: "0.5rem",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
            borderRadius: "20px",
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="column" spacing={2}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                startIcon={!isMobile && item.icon}
                sx={{
                  textTransform: "none",
                  color: "black",
                  justifyContent: isMobile ? "center" : "flex-start",
                  minWidth: isMobile ? "48px" : "auto",
                  p: isMobile ? "8px" : "8px 16px",
                }}
              >
                {isMobile ? item.icon : item.text}
              </Button>
            ))}
            <Divider sx={{ my: 1 }} />
            {footerItems.map((item) => (
              <Button
                key={item.text}
                onClick={item.onClick}
                startIcon={!isMobile && item.icon}
                color={item.color || "primary"}
                sx={{
                  textTransform: "none",
                  color: item.color === "error" ? "error.main" : "black",
                  justifyContent: isMobile ? "center" : "flex-start",
                  minWidth: isMobile ? "48px" : "auto",
                  p: isMobile ? "8px" : "8px 16px",
                }}
              >
                {isMobile ? item.icon : item.text}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, padding: "1rem" }}>
          <Typography variant="h4" gutterBottom>
            คนที่คุณกดถูกใจ
          </Typography>
          {likedUsers.length > 0 ? (
            <Box
              sx={{
                maxHeight: "79vh",
                overflowY: "auto",
                paddingRight: "1rem",
                borderRadius: "20px",
              }}
            >
              <Stack spacing={2}>
                {likedUsers.map((likedUser) => (
                  <Paper
                    key={likedUser.id}
                    sx={{
                      padding: "1rem",
                      border: "1px solid #eee",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                      borderRadius: "20px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    onClick={() => setSelectedUser(likedUser)}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <img
                          src={
                            likedUser.profile_picture
                              ? `http://localhost:3000${likedUser.profile_picture}`
                              : "http://localhost:3000/uploads/anonymous.jpg"
                          }
                          alt="Profile"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "10%",
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Typography variant="h6">
                            {likedUser.nickname || "Anonymous"} - ความคล้าย{" "}
                            {likedUser.similarity}%
                          </Typography>
                          {[
                            "type",
                            "clean",
                            "drink",
                            "smoke",
                            "expense",
                            "loud",
                          ].map((key) => (
                            <Typography key={key} variant="body2">
                              <strong>{labelMapping[key]}:</strong>{" "}
                              {valueMapping[likedUser[key]] || likedUser[key]}
                            </Typography>
                          ))}
                        </Box>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ) : (
            <Typography variant="body1">ไม่มีคนที่คุณกดถูกใจ</Typography>
          )}
        </Box>
      </Box>

      {/* Modal for User Details */}
      {selectedUser && (
        <Modal
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          aria-labelledby="user-details-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%",
              minWidth: "500px",
              maxHeight: "90vh",
              overflow: "auto",
              backgroundColor: "white",
              padding: "2rem",
              boxShadow: 24,
              borderRadius: "15px",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <img
                src={
                  selectedUser.profile_picture
                    ? `http://localhost:3000${selectedUser.profile_picture}`
                    : "http://localhost:3000/uploads/anonymous.jpg"
                }
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10%",
                  objectFit: "cover",
                }}
              />
              <Box>
                <Typography variant="h5" component="h2">
                  {selectedUser.nickname || "Anonymous"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ความคล้าย {selectedUser.similarity}%
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Personal Information */}
            <Typography variant="h6" gutterBottom>
              ข้อมูลส่วนตัว
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ชื่อจริง:</strong> {selectedUser.firstname}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>นามสกุล:</strong> {selectedUser.lastname}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>อายุ:</strong> {selectedUser.age} ปี
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>สถานะ:</strong>{" "}
                  {maritalStatusMapping[selectedUser.maritalstatus]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>เพศ:</strong> {genderMapping[selectedUser.gender]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ความหลากหลายทางเพศ:</strong>{" "}
                  {selectedUser.lgbt ? "ใช่" : "ไม่ใช่"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>หอพัก:</strong> {selectedUser.dorm_name || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ค่าหอพักต่อเดือน:</strong>{" "}
                  {selectedUser.monthly_dorm_fee
                    ? `฿${selectedUser.monthly_dorm_fee.toLocaleString()}`
                    : "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ยานพาหนะ:</strong>{" "}
                  {vehicleMapping[selectedUser.vehicle] || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>จังหวัด:</strong> {selectedUser.province}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>มหาวิทยาลัย:</strong> {selectedUser.university}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>ข้อความเพิ่มเติม:</strong>{" "}
                  {selectedUser.self_introduction}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Contact Information */}
            <Typography variant="h6" gutterBottom>
              ข้อมูลการติดต่อ
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Facebook:</strong>{" "}
                  {selectedUser.facebook || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Instagram:</strong>{" "}
                  {selectedUser.instagram || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Line ID:</strong> {selectedUser.line_id || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>เบอร์โทรศัพท์:</strong> แสดงเมื่อจับคู่สำเร็จ
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Personality Traits */}
            <Typography variant="h6" gutterBottom>
              ลักษณะนิสัย
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(selectedUser).map(([key, value]) => {
                if (!labelMapping[key]) return null;
                const matchHighlight =
                  currentUserTraits && value === currentUserTraits[key];

                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography
                      sx={{
                        border: matchHighlight
                          ? "1px solid #4caf50"
                          : "1px solid transparent",
                        borderRadius: "15px",
                        padding: "8px",
                        backgroundColor: matchHighlight
                          ? "#d5edd6"
                          : "transparent",
                      }}
                    >
                      <strong>{labelMapping[key]}:</strong>{" "}
                      {valueMapping[value] || value}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleLike(selectedUser.user_id)}
              >
                ถอนถูกใจ
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setReportDialogOpen(true)}
              >
                รายงาน
              </Button>
              <Button variant="outlined" onClick={() => setSelectedUser(null)}>
                ปิด
              </Button>
            </Stack>
          </Box>
        </Modal>
      )}

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายงานผู้ใช้</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>ประเภทการรายงาน</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="ประเภทการรายงาน"
              >
                <MenuItem value="harassment">คุกคามทางเพศ</MenuItem>
                <MenuItem value="fraud">ฉ้อโกง</MenuItem>
                <MenuItem value="scam">หลอกลวง</MenuItem>
                <MenuItem value="fake_profile">โปรไฟล์ปลอม</MenuItem>
                <MenuItem value="inappropriate">เนื้อหาไม่เหมาะสม</MenuItem>
                <MenuItem value="other">อื่นๆ</MenuItem>
              </Select>
            </FormControl>

            <TextField
              multiline
              rows={4}
              label="คำอธิบาย"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>ยกเลิก</Button>
          <Button
            onClick={async () => {
              try {
                await axios.post("/reports/user", {
                  reporter_id: user.id,
                  reported_user_id: selectedUser.user_id,
                  type: reportType,
                  description: reportDescription,
                });
                showAlert("ส่งรายงานเรียบร้อยแล้ว", "success");
                setReportDialogOpen(false);
                setReportType("");
                setReportDescription("");
              } catch (err) {
                showAlert("เกิดข้อผิดพลาดในการส่งรายงาน", "error");
              }
            }}
            variant="contained"
            color="primary"
          >
            ส่งรายงาน
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
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
      {/* Report User Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายงานผู้ใช้</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>ประเภทการรายงาน</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="ประเภทการรายงาน"
              >
                <MenuItem value="harassment">คุกคามทางเพศ</MenuItem>
                <MenuItem value="fraud">ฉ้อโกง</MenuItem>
                <MenuItem value="scam">หลอกลวง</MenuItem>
                <MenuItem value="fake_profile">โปรไฟล์ปลอม</MenuItem>
                <MenuItem value="inappropriate">เนื้อหาไม่เหมาะสม</MenuItem>
                <MenuItem value="other">อื่นๆ</MenuItem>
              </Select>
            </FormControl>

            <TextField
              multiline
              rows={4}
              label="คำอธิบาย"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>ยกเลิก</Button>
          <Button
            onClick={async () => {
              try {
                await axios.post("/reports/user", {
                  reporter_id: user.id,
                  reported_user_id: selectedUser.user_id,
                  type: reportType,
                  description: reportDescription,
                });
                showAlert("ส่งรายงานเรียบร้อยแล้ว", "success");
                setReportDialogOpen(false);
                setReportType("");
                setReportDescription("");
              } catch (err) {
                showAlert("เกิดข้อผิดพลาดในการส่งรายงาน", "error");
              }
            }}
            variant="contained"
            color="primary"
          >
            ส่งรายงาน
          </Button>
        </DialogActions>
      </Dialog>

      {/* System Report/Suggestion Dialog */}
      <Dialog
        open={systemReportDialog}
        onClose={() => setSystemReportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isSuggestion ? "ข้อเสนอแนะ" : "แจ้งปัญหาการใช้งาน"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {!isSuggestion && (
              <FormControl fullWidth>
                <InputLabel>ประเภทปัญหา</InputLabel>
                <Select
                  value={systemReportType}
                  onChange={(e) => setSystemReportType(e.target.value)}
                  label="ประเภทปัญหา"
                >
                  <MenuItem value="bug">ข้อผิดพลาดของระบบ</MenuItem>
                  <MenuItem value="ui">ปัญหาการแสดงผล</MenuItem>
                  <MenuItem value="performance">ปัญหาประสิทธิภาพ</MenuItem>
                  <MenuItem value="feature">ฟีเจอร์ไม่ทำงาน</MenuItem>
                  <MenuItem value="other">อื่นๆ</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              multiline
              rows={4}
              label={isSuggestion ? "ข้อเสนอแนะ" : "คำอธิบาย"}
              value={systemDescription}
              onChange={(e) => setSystemDescription(e.target.value)}
              fullWidth
              required
            />

            {!isSuggestion && (
              <Box>
                <input
                  accept="image/*"
                  id="report-image"
                  type="file"
                  hidden
                  onChange={handleImageChange}
                />
                <label htmlFor="report-image">
                  <Button variant="outlined" component="span" fullWidth>
                    แนบรูปภาพ
                  </Button>
                </label>
                {reportImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={reportImagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                    <Button
                      color="error"
                      onClick={() => {
                        setReportImage(null);
                        setReportImagePreview("");
                      }}
                      sx={{ mt: 1 }}
                    >
                      ลบรูปภาพ
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSystemReportDialog(false);
              setSystemReportType("");
              setSystemDescription("");
              setReportImage(null);
              setReportImagePreview("");
              setIsSuggestion(false);
            }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleSystemReport}
            variant="contained"
            color="primary"
            disabled={
              (!isSuggestion && !systemReportType) || !systemDescription
            }
          >
            ส่ง{isSuggestion ? "ข้อเสนอแนะ" : "รายงาน"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default Liked;
