import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";
import AppTheme from "../AppTheme";
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Container,
  CssBaseline,
  Alert,
} from "@mui/material";
import { CheckCircle } from "lucide-react";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user_id } = location.state || {};

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
      // Scroll to top where error message is shown
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setShowError(false);

    try {
      await axios.post("/personalitytraits", { user_id, ...traits });
      navigate("/discovery");
    } catch (err) {
      alert("Error saving traits");
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
            sx={{ mb: 4 }}
          >
            ลักษณะนิสัย
          </Typography>

          {showError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              กรุณาตอบคำถามให้ครบทุกข้อ
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 4,
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
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ textTransform: "none" }}
                  >
                    ย้อนกลับ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                  >
                    บันทึก
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </AppTheme>
  );
};

export default PersonalityProfile;
