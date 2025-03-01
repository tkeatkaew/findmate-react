import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Star } from "lucide-react";
import axios from "../services/api";

const AppReviewForm = ({ open, onClose }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleSubmit = async () => {
    if (rating === 0) {
      setAlert({
        open: true,
        message: "กรุณาให้คะแนนก่อนส่ง",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post("/app-reviews", {
        user_id: user.id || null,
        rating,
        feedback,
      });

      setAlert({
        open: true,
        message: "ขอบคุณสำหรับความคิดเห็นของคุณ!",
        severity: "success",
      });

      // Reset form and close dialog after a brief delay
      setTimeout(() => {
        setRating(5);
        setFeedback("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      setAlert({
        open: true,
        message: "เกิดข้อผิดพลาดในการส่งความคิดเห็น โปรดลองอีกครั้ง",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>ให้คะแนนและความคิดเห็นสำหรับ Find Mate</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom>
                ช่วยเราปรับปรุงแอปพลิเคชันด้วยคะแนนและความคิดเห็นของคุณ
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Stack direction="row" spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      onClick={() => setRating(star)}
                      sx={{
                        color: star <= rating ? "warning.main" : "grey.300",
                      }}
                    >
                      <Star
                        size={32}
                        fill={star <= rating ? "currentColor" : "none"}
                      />
                    </IconButton>
                  ))}
                </Stack>
              </Box>

              <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
                {rating} / 5
              </Typography>
            </Box>

            <TextField
              multiline
              rows={4}
              label="ความคิดเห็น (ไม่บังคับ)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              fullWidth
              placeholder="แนะนำหรือแสดงความคิดเห็นเกี่ยวกับแอปพลิเคชัน..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default AppReviewForm;
