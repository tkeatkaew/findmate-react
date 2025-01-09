import React, { useEffect, useState } from "react";
import axios from "../services/api";
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
import AppTheme from "../AppTheme";

const Discovery = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [likeStatus, setLikeStatus] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.post("/knn", { user_id: user.id });
      setUsers(data.neighbors);

      // Fetch like status for all users
      const statuses = {};
      for (const neighbor of data.neighbors) {
        try {
          const likeResponse = await axios.get("/check-like", {
            params: {
              user_id: user.id,
              target_user_id: neighbor.user_id,
            },
          });
          statuses[neighbor.user_id] = likeResponse.data.isLiked;
        } catch (err) {
          console.error("Error checking like status:", err);
        }
      }
      setLikeStatus(statuses);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleLike = async (targetUserId, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedUser(null);
    try {
      const action = likeStatus[targetUserId] ? "unlike" : "like";
      await axios.post("/like", {
        user_id: user.id,
        liked_user_id: targetUserId,
        action: action,
      });
      setSelectedUser(null);

      // Update local state
      setLikeStatus((prev) => ({
        ...prev,
        [targetUserId]: !prev[targetUserId],
      }));

      showAlert(
        action === "like"
          ? "User liked successfully!"
          : "User unliked successfully!",
        "success"
      );
    } catch (err) {
      setSelectedUser(null);
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
    setAlert({ ...alert, open: false });
  };

  return (
    <AppTheme>
      <Box sx={{ display: "flex", minHeight: "90vh" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: "200px",
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
          <Stack
            direction="column"
            spacing={2}
            sx={{
              flex: "1 1 auto",
              justifyContent: "top",
            }}
          >
            <Button
              component={Link}
              to="/discovery"
              sx={{ textTransform: "none" }}
            >
              ค้นหารูมเมท
            </Button>
            <Button component={Link} to="/liked" sx={{ textTransform: "none" }}>
              ชอบ
            </Button>
            <Button
              component={Link}
              to="/matched"
              sx={{ textTransform: "none" }}
            >
              จับคู่
            </Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, padding: "1rem" }}>
          <Typography variant="h4" gutterBottom>
            ค้นหารูมเมทที่คล้ายคลึงกับคุณ
          </Typography>
          {users.length > 0 ? (
            <Box
              sx={{
                maxHeight: "79vh",
                overflowY: "auto",
                paddingRight: "1rem",
                borderRadius: "20px",
              }}
            >
              <Stack spacing={2}>
                {users.map((neighbor) => (
                  <Paper
                    key={neighbor.user_id}
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
                    onClick={() => setSelectedUser(neighbor)}
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
                            neighbor.traits.profile_picture ||
                            "http://localhost:3000/uploads/anonymous.jpg"
                          }
                          alt="Profile"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "10%",
                          }}
                        />
                        <Box>
                          <Typography variant="h6">
                            {neighbor.traits.nickname || "Anonymous"} -{" "}
                            ความคล้ายคลึง {neighbor.similarity}%
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
                              {valueMapping[neighbor.traits[key]] ||
                                neighbor.traits[key]}
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
            <Typography variant="body1">กำลังโหลด ...</Typography>
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
                  selectedUser.traits.profile_picture ||
                  "http://localhost:3000/uploads/anonymous.jpg"
                }
                alt="Profile"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                }}
              />
              <Box>
                <Typography variant="h5" component="h2">
                  {selectedUser.traits.nickname || "Anonymous"}
                </Typography>
                <Typography variant="subtitle1">
                  ความคล้ายคลึง {selectedUser.similarity}%
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
                  <strong>ชื่อจริง:</strong> {selectedUser.traits.firstname}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>นามสกุล:</strong> {selectedUser.traits.lastname}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>อายุ:</strong> {selectedUser.traits.age} ปี
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>สถานะ:</strong>{" "}
                  {maritalStatusMapping[selectedUser.traits.maritalstatus]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>เพศ:</strong>{" "}
                  {genderMapping[selectedUser.traits.gender]}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ความหลากหลายทางเพศ:</strong>{" "}
                  {selectedUser.traits.lgbt ? "ใช่" : "ไม่ใช่"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>หอพัก:</strong>{" "}
                  {selectedUser.traits.dorm_name || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ยานพาหนะ:</strong>{" "}
                  {vehicleMapping[selectedUser.traits.vehicle] || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>จังหวัด:</strong> {selectedUser.traits.province}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>มหาวิทยาลัย:</strong> {selectedUser.traits.university}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>แนะนำตัว:</strong>{" "}
                  {selectedUser.traits.self_introduction}
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
                  {selectedUser.traits.facebook || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Instagram:</strong>{" "}
                  {selectedUser.traits.instagram || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Line ID:</strong>{" "}
                  {selectedUser.traits.line_id || "ไม่ระบุ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>เบอร์โทรศัพท์:</strong>{" "}
                  {"แสดงเมื่อจับคู่สำเร็จ" || "ไม่ระบุ"}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Personality Traits */}
            <Typography variant="h6" gutterBottom>
              ลักษณะนิสัย
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(selectedUser.traits).map(
                ([key, value]) =>
                  labelMapping[key] && (
                    <Grid item xs={12} sm={6} key={key}>
                      <Typography>
                        <strong>{labelMapping[key]}:</strong>{" "}
                        {valueMapping[value] || value}
                      </Typography>
                    </Grid>
                  )
              )}
            </Grid>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color={likeStatus[selectedUser.user_id] ? "error" : "primary"}
                onClick={() => handleLike(selectedUser.user_id)}
              >
                {likeStatus[selectedUser.user_id] ? "ถอนถูกใจ" : "ถูกใจ"}
              </Button>
              <Button variant="outlined" onClick={() => setSelectedUser(null)}>
                ปิด
              </Button>
            </Stack>
          </Box>
        </Modal>
      )}

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
    </AppTheme>
  );
};

export default Discovery;
