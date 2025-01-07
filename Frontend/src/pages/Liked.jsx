import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import AppTheme from "../AppTheme";

const Liked = () => {
  const [likedUsers, setLikedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch liked users
  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        const { data } = await axios.get("/liked", {
          params: { user_id: user.id },
        });
        setLikedUsers(data);
      } catch (err) {
        console.error("Error fetching liked users", err);
      }
    };
    fetchLikedUsers();
  }, [user]);

  // Handle opening modal
  const handleOpenDetails = (user) => {
    setSelectedUser(user);
  };

  // Handle closing modal
  const handleCloseDetails = () => {
    setSelectedUser(null);
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
              Discover
            </Button>
            <Button component={Link} to="/liked" sx={{ textTransform: "none" }}>
              Liked
            </Button>
            <Button
              component={Link}
              to="/matched"
              sx={{ textTransform: "none" }}
            >
              Matched
            </Button>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, padding: "1rem" }}>
          <Typography variant="h4" gutterBottom>
            Liked Users
          </Typography>
          {likedUsers.length > 0 ? (
            <Box
              sx={{
                maxHeight: "79vh",
                overflowY: "auto",
                paddingRight: "1rem",
                borderRadius: "15px",
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
                      borderRadius: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenDetails(likedUser)}
                  >
                    <img
                      src={likedUser.profile_picture || "/default-profile.png"}
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        marginRight: "1rem",
                      }}
                    />
                    <Typography variant="h6">
                      {likedUser.name || "No Name"}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ) : (
            <Typography variant="body1">No liked users found.</Typography>
          )}
        </Box>
      </Box>

      {/* Modal for User Details */}
      {selectedUser && (
        <Modal
          open={!!selectedUser}
          onClose={handleCloseDetails}
          aria-labelledby="user-details-modal"
          aria-describedby="user-details-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%",
              minWidth: "500px",
              backgroundColor: "white",
              padding: "2rem",
              boxShadow: 24,
              borderRadius: "15px",
            }}
          >
            <Typography id="user-details-modal" variant="h5" gutterBottom>
              {selectedUser.name}
            </Typography>
            <Stack spacing={2}>
              {Object.entries(selectedUser).map(
                ([key, value]) =>
                  labelMapping[key] && (
                    <Typography key={key} variant="body2">
                      <strong>{labelMapping[key]}:</strong>{" "}
                      {valueMapping[value] || value}
                    </Typography>
                  )
              )}
            </Stack>
            <Button
              variant="contained"
              onClick={handleCloseDetails}
              sx={{ marginTop: "1rem" }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </AppTheme>
  );
};

export default Liked;
