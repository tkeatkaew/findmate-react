import React from "react";
import AppTheme from "../AppTheme";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Link,
  Button,
  Divider,
  CssBaseline,
  Paper,
} from "@mui/material";
import {
  Github,
  Linkedin,
  Globe,
  Facebook,
  Instagram,
  QrCode,
  CreditCard,
  GraduationCap,
  Code,
  Heart,
} from "lucide-react";

import Promtpay from "../images/Promtpay.jpg";

// Creator component
const CreatorCard = ({ name, role, image, bio, links, education }) => (
  <Card
    sx={{
      borderRadius: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      border: "1px solid #eee",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <CardContent>
      <Stack spacing={2} alignItems="center">
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            objectFit: "cover",
            mb: 2,
            border: "4px solid #fff",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Typography variant="h5" component="h2" align="center">
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          {role}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          {links.map((link, index) => (
            <IconButton
              key={index}
              icon={link.icon}
              href={link.url}
              label={link.label}
            />
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <GraduationCap size={20} />
            <Typography variant="body2" color="text.secondary">
              {education}
            </Typography>
          </Stack>
        </Box>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          {bio}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

// Icon button component
const IconButton = ({ icon: Icon, href, label }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color: "text.secondary",
      "&:hover": {
        color: "primary.main",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: "rgba(0, 0, 0, 0.04)",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Icon size={20} />
    </Box>
  </Link>
);

// Donation method component
const DonationMethod = ({ title, details, icon: Icon, image }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: "20px",
      border: "1px solid #eee",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      height: "100%",
    }}
  >
    <Stack spacing={2} alignItems="center">
      {image ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              maxWidth: "300px",
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "inline-flex",
            p: 1,
            borderRadius: "12px",
            bgcolor: "rgba(0, 0, 0, 0.04)",
          }}
        >
          <Icon size={24} />
        </Box>
      )}
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {details}
      </Typography>
    </Stack>
  </Paper>
);

const AboutPage = () => {
  const creators = [
    {
      name: "Teerapat Chomchoey",
      role: "Full Stack Developer",
      image:
        "https://scontent.fbkk13-1.fna.fbcdn.net/v/t39.30808-6/434360523_2038464119861737_8956847562164730460_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=XlgyEISrINgQ7kNvgGvosb9&_nc_oc=Adj_k_6ZXbFD86DjER_qy6Olr-_8eBo20pcF3uSm9p42Pdv2dckUlDdea_pYw3q_Kj0&_nc_zt=23&_nc_ht=scontent.fbkk13-1.fna&_nc_gid=ACqBSHcYKH8Jp1dxB87QtOH&oh=00_AYBr4tA5JpBnJW8cec8lyOgpf5_bPakeMgvVFMBRisrk6g&oe=67A10406",
      bio: "Hello! I am a Full Stack Developer with a strong focus on crafting seamless user experiences and robust backend systems. I love building applications that solve real-world problems.",
      education: "Rajamangala University of Technology Lanna Chiang Mai",
      links: [
        {
          icon: Github,
          url: "https://github.com/jschomchoey",
          label: "GitHub",
        },
        {
          icon: Linkedin,
          url: "https://www.linkedin.com/in/teerapat-chomchoey-571150239/",
          label: "LinkedIn",
        },
        {
          icon: Facebook,
          url: "https://www.facebook.com/tpcc.general",
          label: "Facebook",
        },
        {
          icon: Instagram,
          url: "https://www.instagram.com/jschomchoey",
          label: "Instagram",
        },
      ],
    },
    {
      name: "Jittapong Jongjai",
      role: "Frontend Developer",
      image:
        "https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-1/407671912_3114387742029699_3195186485123866947_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=514wNeVpEEYQ7kNvgF1u0RB&_nc_oc=Adh0xT3_2IPkPBX6Iq_rFrjyK3m-e6I5cIHp4SLuQABwrsRRnvqsjOvkCybRwdZKWY0&_nc_zt=24&_nc_ht=scontent.fbkk12-4.fna&_nc_gid=A9QQYJHosksz2YdI-ksEhRp&oh=00_AYByTtG5c-Q-jby_jYuhz1Uw_QkAI1DHlBGuprbp8DaqkA&oe=67A0EEF9",
      bio: "An enthusiastic Frontend Developer passionate about creating beautiful and intuitive user interfaces. I specialize in React and modern web technologies.",
      education: "Rajamangala University of Technology Lanna Chiang Mai",
      links: [
        {
          icon: Github,
          url: "https://github.com/Jittapongj",
          label: "GitHub",
        },
        {
          icon: Facebook,
          url: "https://www.facebook.com/thiztoon",
          label: "Facebook",
        },
        {
          icon: Instagram,
          url: "https://www.instagram.com/thiztoon/",
          label: "Instagram",
        },
      ],
    },
  ];

  const donationMethods = [
    {
      title: "Prompt Pay",
      image: Promtpay,
      details: "Prompt Pay: 061-698-9385 (Teerapat Chomchoey)",
    },
    {
      title: "Bank Transfer",
      icon: CreditCard,
      details: "SCB Bank: 405-984-7085 (Teerapat Chomchoey)",
    },
  ];

  return (
    <AppTheme>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "90vh", py: 8 }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              เกี่ยวกับเรา
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Find Mate เกิดขึ้นจากโปรเจกต์จบการศึกษาของนักศึกษาสองคน
              ที่มีเป้าหมายในการแก้ปัญหาการหารูมเมทของนักศึกษา
            </Typography>
          </Box>

          {/* Project Info */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "20px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                  height: "100%",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Code size={32} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  เทคโนโลยีที่ใช้
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  React, Node.js, Express, MySQL และ Machine Learning (KNN
                  Algorithm)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "20px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                  height: "100%",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Heart size={32} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  แรงบันดาลใจ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  เพื่อช่วยให้นักศึกษาสามารถหารูมเมทที่เข้ากับไลฟ์สไตล์ของตนเองได้ง่ายขึ้น
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "20px",
                  border: "1px solid #eee",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                  height: "100%",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <GraduationCap size={32} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  โครงการ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  โปรเจกต์จบการศึกษาปี 2567
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Creators Section */}
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            ผู้พัฒนา
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {creators.map((creator, index) => (
              <Grid item xs={12} md={6} key={index}>
                <CreatorCard {...creator} />
              </Grid>
            ))}
          </Grid>

          {/* Donation Section */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              สนับสนุนพวกเรา
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              หากคุณชื่นชอบโครงการนี้
              สามารถร่วมสนับสนุนพวกเราได้ผ่านช่องทางด้านล่าง
            </Typography>
            <Grid container spacing={3}>
              {donationMethods.map((method, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <DonationMethod {...method} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </AppTheme>
  );
};

export default AboutPage;
