import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import AppTheme from "../AppTheme";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [passwordError, setPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const navigate = useNavigate();
  const role = "user";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/discovery");
    }
  }, [navigate]);

  // Password validation function
  const validatePassword = (password) => {
    // Check password length
    if (password.length < 8) {
      return "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว";
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว";
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว";
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว";
    }

    return "";
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword) {
      const error = validatePassword(newPassword);
      setPasswordError(error);
    } else {
      setPasswordError("");
    }
  };

  const handleTermsAcceptedChange = (e) => {
    setTermsAccepted(e.target.checked);
    if (e.target.checked) {
      setTermsError(false);
    }
  };

  const handleOpenTermsDialog = () => {
    setOpenTermsDialog(true);
  };

  const handleCloseTermsDialog = () => {
    setOpenTermsDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setMessage(passwordValidationError);
      setAlertSeverity("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      setAlertSeverity("error");
      return;
    }

    // Validate terms accepted
    if (!termsAccepted) {
      setTermsError(true);
      setMessage("กรุณายอมรับข้อตกลงและเงื่อนไขการใช้บริการ");
      setAlertSeverity("error");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
        role,
        terms_accepted: termsAccepted,
      });

      setMessage("กรุณาตรวจสอบรหัส OTP ในอีเมลของคุณ");
      setAlertSeverity("success");

      navigate("/verify-otp", {
        state: {
          registration_id: data.registration_id,
          email,
        },
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      setAlertSeverity("error");
      setIsLoading(false);
    }
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          padding: "2rem",
          maxWidth: "400px",
          margin: "auto",
          marginTop: "3rem",
          border: "1px solid #eee",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
            สมัครใช้งาน
          </Typography>

          {message && (
            <Alert severity={alertSeverity} onClose={() => setMessage("")}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                type="text"
                label="ยูสเซอร์เนม"
                placeholder="ยูสเซอร์เนมของคุณ"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                required
                type="email"
                label="อีเมล"
                placeholder="อีเมลของคุณ"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Box>
                <TextField
                  required
                  type="password"
                  label="รหัสผ่าน"
                  placeholder="••••••••"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  error={!!passwordError}
                />
                {password && (
                  <FormHelperText
                    error={!!passwordError}
                    sx={{ marginLeft: "14px", marginTop: "4px" }}
                  >
                    {passwordError}
                  </FormHelperText>
                )}
              </Box>
              <TextField
                required
                type="password"
                label="ยืนยันรหัสผ่าน"
                placeholder="••••••••"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                error={confirmPassword && password !== confirmPassword}
                helperText={
                  confirmPassword && password !== confirmPassword
                    ? "รหัสผ่านไม่ตรงกัน"
                    : ""
                }
              />
              <FormHelperText
                sx={{
                  marginLeft: "14px",
                  marginTop: "4px",
                  color: "text.secondary",
                }}
              >
                รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร,
                ประกอบด้วยตัวอักษรพิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข และอักขระพิเศษ
              </FormHelperText>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={handleTermsAcceptedChange}
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label={
                  <Typography variant="body2">
                    ฉันได้อ่านและยอมรับ{" "}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleOpenTermsDialog}
                      type="button"
                    >
                      ข้อตกลงและเงื่อนไขการใช้บริการ
                    </Link>
                  </Typography>
                }
                sx={{ marginTop: "8px" }}
              />
              {termsError && (
                <FormHelperText
                  error
                  sx={{ marginLeft: "14px", marginTop: "-8px" }}
                >
                  กรุณายอมรับข้อตกลงและเงื่อนไขการใช้บริการก่อนดำเนินการต่อ
                </FormHelperText>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  textTransform: "none",
                  height: "42px", // Fixed height to prevent button size change
                  marginTop: "16px",
                }}
              >
                {isLoading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <Typography>กำลังส่ง OTP...</Typography>
                  </Stack>
                ) : (
                  "สมัครใช้งาน"
                )}
              </Button>
              <Typography
                component="div"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                มีบัญชี Find Mate อยู่แล้ว?{" "}
                <Link href="/login" variant="body2">
                  เข้าสู่ระบบ
                </Link>
              </Typography>
            </Stack>
          </form>
        </Stack>
      </Box>

      {/* Terms of Service Dialog */}
      <Dialog
        open={openTermsDialog}
        onClose={handleCloseTermsDialog}
        scroll="paper"
        aria-labelledby="terms-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="terms-dialog-title">
          ข้อตกลงและเงื่อนไขการใช้บริการแพลตฟอร์ม Find Mate
          <IconButton
            aria-label="close"
            onClick={handleCloseTermsDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="terms-dialog-description"
            tabIndex={-1}
            component="div"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              วันที่มีผลบังคับใช้: 10 มีนาคม 2567
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
              บทนำ
            </Typography>
            <Typography paragraph>
              ข้อตกลงและเงื่อนไขการใช้บริการฉบับนี้ ("ข้อตกลง")
              กำหนดเงื่อนไขที่ผูกพันทางกฎหมายระหว่างบริษัท Find Mate ("บริษัท"
              หรือ "ผู้ให้บริการ") และบุคคลที่เข้าถึงหรือใช้งานแพลตฟอร์ม Find
              Mate ("ผู้ใช้บริการ" หรือ "ท่าน")
              ข้อตกลงนี้ควบคุมการเข้าถึงและการใช้งานแพลตฟอร์ม Find Mate
              รวมถึงเว็บไซต์ แอปพลิเคชัน และบริการทั้งหมดที่เกี่ยวข้อง
              (รวมเรียกว่า "แพลตฟอร์ม")
              ซึ่งเป็นแพลตฟอร์มที่ออกแบบมาเพื่อช่วยในการค้นหาและจับคู่รูมเมทสำหรับนักศึกษา
            </Typography>
            <Typography paragraph>
              โปรดอ่านข้อตกลงนี้โดยละเอียดก่อนการเข้าถึงหรือใช้งานแพลตฟอร์ม
              การเข้าถึงหรือใช้งานแพลตฟอร์มไม่ว่าในลักษณะใดถือเป็นการยอมรับและตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุในข้อตกลงนี้
              หากท่านไม่เห็นด้วยกับข้อกำหนดและเงื่อนไขใดๆ ของข้อตกลงนี้
              ท่านไม่มีสิทธิ์ในการเข้าถึงหรือใช้งานแพลตฟอร์ม
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
              1. นิยามและคำจำกัดความ
            </Typography>
            <Typography component="div" paragraph>
              <Box sx={{ ml: 2 }}>
                <Typography paragraph>
                  1.1 "ผู้ใช้บริการ" หมายถึง
                  บุคคลธรรมดาที่ได้ลงทะเบียนและสร้างบัญชีผู้ใช้บนแพลตฟอร์ม Find
                  Mate
                </Typography>
                <Typography paragraph>
                  1.2 "บัญชีผู้ใช้" หมายถึง
                  บัญชีส่วนบุคคลที่ผู้ใช้บริการสร้างขึ้นบนแพลตฟอร์ม Find Mate
                  โดยให้ข้อมูลที่จำเป็นและได้รับการยืนยันตัวตนผ่านกระบวนการที่กำหนด
                </Typography>
                <Typography paragraph>
                  1.3 "เนื้อหาผู้ใช้" หมายถึง ข้อมูล ข้อความ รูปภาพ หรือสื่อใดๆ
                  ที่ผู้ใช้บริการอัปโหลด โพสต์ ส่ง หรือจัดเตรียมผ่านแพลตฟอร์ม
                  รวมถึงแต่ไม่จำกัดเพียงข้อมูลส่วนบุคคล ลักษณะนิสัย
                  และข้อมูลการติดต่อ
                </Typography>
                <Typography paragraph>
                  1.4 "ข้อมูลส่วนบุคคล" หมายถึง
                  ข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวบุคคลนั้นได้ไม่ว่าทางตรงหรือทางอ้อม
                  ตามที่นิยามไว้ในพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                </Typography>
                <Typography paragraph>
                  1.5 "การจับคู่" หมายถึง
                  เหตุการณ์ที่เกิดขึ้นเมื่อผู้ใช้บริการสองรายแสดงความสนใจซึ่งกันและกันผ่านฟังก์ชันการถูกใจบนแพลตฟอร์ม
                </Typography>
                <Typography paragraph>
                  1.6 "ข้อมูลการติดต่อ" หมายถึง
                  ข้อมูลที่ใช้ในการติดต่อผู้ใช้บริการ
                  ซึ่งรวมถึงแต่ไม่จำกัดเพียงชื่อบัญชีโซเชียลมีเดีย ไอดีไลน์
                  และหมายเลขโทรศัพท์
                </Typography>
              </Box>
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
              2. การลงทะเบียนและบัญชีผู้ใช้
            </Typography>
            <Typography sx={{ fontWeight: "bold", mt: 1 }}>
              2.1 คุณสมบัติของผู้ใช้บริการ
            </Typography>
            <Typography paragraph>
              ในการลงทะเบียนและใช้งานแพลตฟอร์ม ผู้ใช้บริการต้อง:
            </Typography>
            <Typography component="div">
              <Box sx={{ ml: 2 }}>
                <Typography paragraph>
                  (ก) มีอายุไม่ต่ำกว่า 15 ปีบริบูรณ์
                  <br />
                  (ข) มีความสามารถทางกฎหมายในการเข้าทำสัญญาที่มีผลผูกพัน
                  <br />
                  (ค)
                  ไม่เคยถูกระงับหรือเพิกถอนสิทธิ์การใช้งานแพลตฟอร์มก่อนหน้านี้
                  <br />
                  (ง) ปฏิบัติตามข้อกำหนดและเงื่อนไขทั้งหมดในข้อตกลงนี้
                </Typography>
              </Box>
            </Typography>

            <Typography variant="body2" sx={{ fontStyle: "italic", mt: 2 }}>
              [ข้อตกลงนี้มีเนื้อหาต่อเนื่องอีกหลายส่วน
              ซึ่งท่านสามารถอ่านฉบับเต็มได้โดยคลิกที่ลิงก์
              "ข้อตกลงและเงื่อนไขการใช้บริการฉบับเต็ม" ด้านล่าง]
            </Typography>

            <Box sx={{ mt: 3, bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                สรุปสาระสำคัญ:
              </Typography>
              <Typography component="div">
                <ul>
                  <li>ผู้ใช้บริการต้องมีอายุ 15 ปีบริบูรณ์ขึ้นไป</li>
                  <li>ข้อมูลส่วนบุคคลจะถูกเก็บรวบรวมเพื่อการจับคู่รูมเมท</li>
                  <li>
                    ข้อมูลการติดต่อจะเปิดเผยเฉพาะเมื่อเกิดการจับคู่แล้วเท่านั้น
                  </li>
                  <li>ผู้ใช้บริการสามารถลบบัญชีได้ตลอดเวลา</li>
                  <li>การใช้งานแพลตฟอร์มต้องเป็นไปตามกฎหมายและข้อตกลงนี้</li>
                </ul>
              </Typography>
            </Box>

            <Button
              variant="outlined"
              href="/terms-of-service"
              target="_blank"
              sx={{ mt: 3 }}
            >
              ข้อตกลงและเงื่อนไขการใช้บริการฉบับเต็ม
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTermsDialog}>ปิด</Button>
          <Button
            onClick={() => {
              setTermsAccepted(true);
              setTermsError(false);
              handleCloseTermsDialog();
            }}
            variant="contained"
          >
            ยอมรับข้อตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default Register;
