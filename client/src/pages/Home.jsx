import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Heart,
  School,
  Search,
  UserPlus2,
  MessagesSquare,
} from "lucide-react";
import AppTheme from "../AppTheme";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const FeatureCard = ({ icon, title, description }) => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      border: "1px solid #eee",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    }}
  >
    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
      <Box
        sx={{
          display: "inline-flex",
          p: 2,
          borderRadius: "50%",
          bgcolor: "rgba(0, 0, 0, 0.04)",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const StatsCard = ({ icon, value, label }) => (
  <Card
    sx={{
      borderRadius: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      border: "1px solid #eee",
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "inline-flex",
          p: 2,
          borderRadius: "50%",
          bgcolor: "rgba(0, 0, 0, 0.04)",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" gutterBottom>
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
    </CardContent>
  </Card>
);

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalUniversities: 0,
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Redirect to Discovery if user is logged in
    if (user) {
      navigate("/discovery");
      return;
    }

    // Only fetch stats if user is not logged in
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://findmate-react-production.up.railway.app/statistics"
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, [user, navigate]);

  return (
    <AppTheme>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "90vh",
          bgcolor: "background.default",
          pt: 8,
          pb: 12,
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              ค้นหารูมเมทที่ใช่สำหรับคุณ
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Find Mate ช่วยให้คุณค้นหารูมเมทที่มีไลฟ์สไตล์เข้ากับคุณได้ง่ายขึ้น
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              เริ่มต้นใช้งาน
            </Button>
          </Box>

          {/* Statistics */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={<Users size={32} />}
                value={stats.totalUsers}
                label="ผู้ใช้งานทั้งหมด"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={<Heart size={32} />}
                value={stats.totalMatches}
                label="การจับคู่ที่สำเร็จ"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={<School size={32} />}
                value="250"
                label="รองรับมหาลัยทั่วประเทศ"
              />
            </Grid>
          </Grid>

          {/* Features */}
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            ฟีเจอร์หลัก
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<Search size={24} />}
                title="ค้นหาอย่างชาญฉลาด"
                description="ใช้ระบบจับคู่อัจฉริยะที่วิเคราะห์ความเข้ากันได้จากพฤติกรรมและไลฟ์สไตล์"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<UserPlus2 size={24} />}
                title="สร้างโปรไฟล์ที่ครบถ้วน"
                description="แสดงตัวตนของคุณผ่านโปรไฟล์ที่ละเอียด ทั้งไลฟ์สไตล์ ความชอบ และนิสัยการใช้ชีวิต"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                icon={<MessagesSquare size={24} />}
                title="การติดต่อที่ปลอดภัย"
                description="เชื่อมต่อกับรูมเมทที่คุณสนใจผ่านระบบการแชทที่ปลอดภัย เมื่อทั้งสองฝ่ายสนใจกัน"
              />
            </Grid>
          </Grid>

          {/* Benefits */}
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            ทำไมต้อง Find Mate?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #eee",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  🎯 การจับคู่ที่แม่นยำ
                </Typography>
                <List>
                  {[
                    "วิเคราะห์ความเข้ากันได้จาก 15 ปัจจัยสำคัญ",
                    "พิจารณาทั้งนิสัย ไลฟ์สไตล์ และความชอบ",
                    "แสดงเปอร์เซ็นต์ความเข้ากันได้",
                  ].map((text, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: "20px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #eee",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  🛡️ ความปลอดภัยเป็นสำคัญ
                </Typography>
                <List>
                  {[
                    "ยืนยันตัวตนผ่านอีเมลสถาบันการศึกษา",
                    "ระบบรายงานผู้ใช้ที่ไม่เหมาะสม",
                    "การเปิดเผยข้อมูลติดต่อเมื่อจับคู่สำเร็จเท่านั้น",
                  ].map((text, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AppTheme>
  );
};

export default HomePage;
