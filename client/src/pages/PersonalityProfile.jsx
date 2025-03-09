import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";
import AppTheme from "../AppTheme";
//import RequiredInfoBanner from "../components/RequiredInfoBanner";
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Container,
  CssBaseline,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { CheckCircle, Info } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";

// Modal component for information disclosure
const InfoModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: "15px",
          maxWidth: "500px",
          p: 1,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Info size={24} color="var(--mui-palette-primary-main)" />
          <Typography variant="h6" component="span">
            ข้อมูลสำคัญ
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
          กรุณากรอกข้อมูลตามความเป็นจริง
          เพื่อที่ระบบจะสามารถคำนวณและแนะนำรูมเมทที่เหมาะสมกับคุณได้อย่างแม่นยำ
        </DialogContentText>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          ข้อมูลนี้จะถูกแสดงให้ผู้ใช้งานอื่นเห็นเพื่อประกอบการตัดสินใจในการเลือกรูมเมท
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{ textTransform: "none" }}
        >
          เข้าใจแล้ว
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Radio Card component for selection options
const RadioCard = ({ option, selected, onSelect }) => (
  <Paper
    onClick={() => onSelect(option.value)}
    sx={{
      p: 2,
      cursor: "pointer",
      borderRadius: "15px",
      border: "1px solid",
      borderColor: selected ? "primary.main" : "white",
      bgcolor: selected ? "rgba(0, 0, 0, 0.00)" : "background.paper",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      transition: "all 0.2s ease",
      position: "relative",
      "&:hover": {
        borderColor: "primary.main",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      },
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack spacing={1} flex={1}>
        <Typography
          variant="body1"
          sx={{ fontWeight: selected ? "600" : "400" }}
        >
          {option.label}
        </Typography>
      </Stack>
      {selected && (
        <CheckCircle
          size={20}
          style={{
            color: "var(--mui-palette-primary-main)",
          }}
        />
      )}
    </Stack>
  </Paper>
);

// Radio Card Group component for a set of options
const RadioCardGroup = ({
  options,
  value,
  onChange,
  title,
  required = true,
}) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
      {title} {required && <span style={{ color: "red" }}>*</span>}
    </Typography>
    <Stack spacing={2}>
      {options.map((option) => (
        <RadioCard
          key={option.value}
          option={option}
          selected={value === option.value}
          onSelect={onChange}
        />
      ))}
    </Stack>
  </Box>
);

const PersonalityProfile = () => {
  const [traits, setTraits] = useState({});
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleModalClose = () => {
    setShowModal(false);
  };

  // First determine the user ID
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // First try to get from location state (from redirects)
    let id = location.state?.user_id;

    // If not available in location state, use localStorage as fallback
    if (!id && storedUser) {
      id = storedUser.id;
    }

    // If we still don't have a user ID, redirect to login
    if (!id) {
      navigate("/login");
      return;
    }

    setUserId(id);
  }, [location.state, navigate]);

  // Fetch existing traits data once we have a userId
  useEffect(() => {
    if (!userId) return;

    const fetchExistingTraits = async () => {
      setIsLoading(true);
      try {
        // Try to get existing traits data from the database
        const response = await axios.get(`/personalitytraits/${userId}`);
        if (response.data) {
          // Pre-fill form with existing data
          setTraits(response.data);
        }
      } catch (error) {
        // It's okay if there's no existing data
        console.log("No existing traits found, starting with empty form");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingTraits();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    const requiredTraits = [
      "type",
      "sleep",
      "wake",
      "clean",
      "air_conditioner",
      "drink",
      "smoke",
      "money",
      "expense",
      "pet",
      "cook",
      "loud",
      "friend",
      "religion",
      "period",
    ];

    const unansweredQuestions = requiredTraits.filter(
      (trait) => !traits[trait]
    );

    if (unansweredQuestions.length > 0) {
      setShowError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setShowError(false);

    try {
      setIsSubmitting(true);

      // Send data to the server - it will handle update vs create
      await axios.post("/personalitytraits", {
        user_id: userId,
        ...traits,
      });

      navigate("/discovery");
    } catch (err) {
      console.error("Error saving personality traits:", err);
      alert("บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (trait) => (value) => {
    setTraits({ ...traits, [trait]: value });
    if (showError) setShowError(false);
  };

  const personalityTypes = [
    { value: "type_introvert", label: "Introvert ชอบสังเกตและฟัง" },
    { value: "type_extrovert", label: "Extrovert ชอบพูดและเข้าสังคม" },
    { value: "type_ambivert", label: "Ambivert สมดุลระหว่างพูดและฟัง" },
  ];

  const sleepingTime = [
    { value: "sleep_before_midnight", label: "ก่อนเที่ยงคืน" },
    { value: "sleep_after_midnight", label: "หลังเที่ยงคืน" },
  ];

  const wakeupTime = [
    { value: "wake_morning", label: "ตื่นตอนเช้า" },
    { value: "wake_noon", label: "ตื่นตอนบ่าย" },
    { value: "wake_evening", label: "ตื่นตอนเย็น" },
  ];

  const cleaningHabits = [
    { value: "clean_every_day", label: "ทำความสะอาดทุกวัน" },
    { value: "clean_every_other_day", label: "ทำความสะอาดวันเว้นวัน" },
    { value: "clean_once_a_week", label: "ทำความสะอาดสัปดาห์ละครั้ง" },
    { value: "clean_dont_really", label: "ไม่ค่อยชอบทำความสะอาด" },
  ];

  const airConditioner = [
    { value: "ac_never", label: "ไม่เปิดเลย" },
    { value: "ac_only_sleep", label: "เปิดเฉพาะเวลานอน" },
    { value: "ac_only_hot", label: "เปิดเฉพาะช่วงอากาศร้อน" },
    { value: "ac_all_day", label: "เปิดทั้งวัน" },
  ];

  const drinkingHabits = [
    { value: "drink_never", label: "ไม่ดื่ม" },
    { value: "drink_spacial", label: "ดื่มเฉพาะโอกาสพิเศษ" },
    { value: "drink_weekend", label: "ดื่มช่วงสุดสัปดาห์" },
    { value: "drink_always", label: "ดื่มเป็นประจำ" },
  ];

  const smokingHabits = [
    { value: "smoke_never", label: "ไม่สูบ" },
    { value: "smoke_spacial", label: "สูบเฉพาะเวลาสังสรรค์" },
    { value: "smoke_always", label: "สูบเป็นประจำ" },
  ];

  const paymentHabits = [
    { value: "money_on_time", label: "ตรงเวลาเสมอ" },
    { value: "money_late", label: "อาจคลาดเคลื่อนเล็กน้อย" },
  ];

  const expenseSharing = [
    { value: "money_half", label: "แบ่งเท่ากัน (ครึ่งต่อครึ่ง)" },
    { value: "money_ratio", label: "ตามสัดส่วนการใช้งาน (ใช้มากจ่ายมากกว่า)" },
  ];

  const petPreference = [
    { value: "pet_dont_have", label: "ไม่เลี้ยง" },
    { value: "pet_have", label: "เลี้ยง" },
  ];

  const cookingAcceptance = [
    { value: "cook_ok", label: "ยอมรับได้" },
    { value: "cook_tell_first", label: "ได้ถ้าบอกล่วงหน้า" },
    { value: "cook_no", label: "ไม่ยอมรับ" },
  ];

  const noiseLevel = [
    { value: "loud_low", label: "ไม่มาก" },
    { value: "loud_medium", label: "ปานกลาง" },
    { value: "loud_high", label: "มาก" },
  ];

  const friendsVisiting = [
    { value: "friend_ok", label: "โอเค" },
    { value: "friend_tell_first", label: "ได้แต่ต้องบอกล่วงหน้า" },
    { value: "friend_no", label: "ไม่โอเค" },
  ];

  const religionAcceptance = [
    { value: "religion_ok", label: "สะดวก" },
    { value: "religion_no_affect", label: "ได้ถ้าไม่กระทบกัน" },
    { value: "religion_no", label: "ไม่สะดวก" },
  ];

  const roommatePreference = [
    { value: "period_long", label: "ต้องการ" },
    { value: "period_sometime", label: "ขึ้นอยู่กับสถานการณ์" },
    { value: "period_no_need", label: "ไม่จำเป็น" },
  ];

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
          minHeight: "90vh",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 2 }}
          >
            ลักษณะนิสัย
          </Typography>

          {/* Add the RequiredInfoBanner here */}
          {/* <RequiredInfoBanner type="traits" /> */}

          {showError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              กรุณาตอบคำถามให้ครบทุกข้อ
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              padding: 2,
              borderRadius: "15px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <RadioCardGroup
                  title="บุคลิกภาพของคุณเป็นแบบใด?"
                  options={personalityTypes}
                  value={traits.type}
                  onChange={handleChange("type")}
                />

                <RadioCardGroup
                  title="คุณมักเข้านอนเวลาใด?"
                  options={sleepingTime}
                  value={traits.sleep}
                  onChange={handleChange("sleep")}
                />

                <RadioCardGroup
                  title="ช่วงเวลาที่คุณตื่นนอนเป็นประจำ?"
                  options={wakeupTime}
                  value={traits.wake}
                  onChange={handleChange("wake")}
                />

                <RadioCardGroup
                  title="คุณทำความสะอาดพื้นที่ส่วนตัวบ่อยแค่ไหน?"
                  options={cleaningHabits}
                  value={traits.clean}
                  onChange={handleChange("clean")}
                />

                <RadioCardGroup
                  title="คุณเปิดเครื่องปรับอากาศบ่อยแค่ไหน?"
                  options={airConditioner}
                  value={traits.air_conditioner}
                  onChange={handleChange("air_conditioner")}
                />

                <RadioCardGroup
                  title="คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?"
                  options={drinkingHabits}
                  value={traits.drink}
                  onChange={handleChange("drink")}
                />

                <RadioCardGroup
                  title="คุณสูบบุหรี่หรือไม่?"
                  options={smokingHabits}
                  value={traits.smoke}
                  onChange={handleChange("smoke")}
                />

                <RadioCardGroup
                  title="คุณจ่ายค่าหอพักตรงเวลาหรือไม่?"
                  options={paymentHabits}
                  value={traits.money}
                  onChange={handleChange("money")}
                />

                <RadioCardGroup
                  title="คุณต้องการแบ่งค่าใช้จ่ายอย่างไร?"
                  options={expenseSharing}
                  value={traits.expense}
                  onChange={handleChange("expense")}
                />

                <RadioCardGroup
                  title="คุณเลี้ยงสัตว์หรือไม่?"
                  options={petPreference}
                  value={traits.pet}
                  onChange={handleChange("pet")}
                />

                <RadioCardGroup
                  title="คุณยอมรับได้หรือไม่หากรูมเมททำอาหารมีกลิ่นแรง?"
                  options={cookingAcceptance}
                  value={traits.cook}
                  onChange={handleChange("cook")}
                />

                <RadioCardGroup
                  title="คุณใช้เสียงดังแค่ไหน?"
                  options={noiseLevel}
                  value={traits.loud}
                  onChange={handleChange("loud")}
                />

                <RadioCardGroup
                  title="คุณโอเคกับการที่รูมเมทพาเพื่อนมาหรือไม่?"
                  options={friendsVisiting}
                  value={traits.friend}
                  onChange={handleChange("friend")}
                />

                <RadioCardGroup
                  title="คุณสะดวกใจกับรูมเมทที่มีความเชื่อทางศาสนาแตกต่างจากคุณหรือไม่?"
                  options={religionAcceptance}
                  value={traits.religion}
                  onChange={handleChange("religion")}
                />

                <RadioCardGroup
                  title="คุณต้องการรูมเมทที่อยู่ร่วมกันระยะยาวหรือไม่?"
                  options={roommatePreference}
                  value={traits.period}
                  onChange={handleChange("period")}
                />

                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
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
                </Box>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Information Modal */}
      <InfoModal open={showModal} onClose={handleModalClose} />
    </AppTheme>
  );
};

export default PersonalityProfile;
