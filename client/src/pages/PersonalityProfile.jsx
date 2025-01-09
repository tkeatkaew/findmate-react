import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/api";

import AppTheme from "../AppTheme";
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
      navigate("/discovery");
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
            ลักษณะนิสัย
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  บุคลิกภาพของคุณเป็นแบบใด?
                </FormLabel>
                <RadioGroup onChange={handleChange("type")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">คุณมักเข้านอนเวลาใด?</FormLabel>
                <RadioGroup onChange={handleChange("sleep")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  ช่วงเวลาที่คุณตื่นนอนเป็นประจำ?
                </FormLabel>
                <RadioGroup onChange={handleChange("wake")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณทำความสะอาดพื้นที่ส่วนตัวบ่อยแค่ไหน?
                </FormLabel>
                <RadioGroup onChange={handleChange("clean")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณเปิดเครื่องปรับอากาศบ่อยแค่ไหน?
                </FormLabel>
                <RadioGroup onChange={handleChange("air_conditioner")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณดื่มแอลกอฮอล์บ่อยแค่ไหน?
                </FormLabel>
                <RadioGroup onChange={handleChange("drink")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">คุณสูบบุหรี่หรือไม่?</FormLabel>
                <RadioGroup onChange={handleChange("smoke")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณจ่ายค่าหอพักตรงเวลาหรือไม่?
                </FormLabel>
                <RadioGroup onChange={handleChange("money")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณต้องการแบ่งค่าใช้จ่ายอย่างไร?
                </FormLabel>
                <RadioGroup onChange={handleChange("expense")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">คุณเลี้ยงสัตว์หรือไม่?</FormLabel>
                <RadioGroup onChange={handleChange("pet")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณยอมรับได้หรือไม่หากรูมเมททำอาหารมีกลิ่นแรง?
                </FormLabel>
                <RadioGroup onChange={handleChange("cook")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">คุณใช้เสียงดังแค่ไหน?</FormLabel>
                <RadioGroup onChange={handleChange("loud")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณโอเคกับการที่รูมเมทพาเพื่อนมาหรือไม่?
                </FormLabel>
                <RadioGroup onChange={handleChange("friend")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณสะดวกใจกับรูมเมทที่มีความเชื่อทางศาสนาแตกต่างจากคุณหรือไม่?
                </FormLabel>
                <RadioGroup onChange={handleChange("religion")}>
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

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">
                  คุณต้องการรูมเมทที่อยู่ร่วมกันระยะยาวหรือไม่?
                </FormLabel>
                <RadioGroup onChange={handleChange("period")}>
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                บันทึก
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </AppTheme>
  );
};

export default PersonalityProfile;
