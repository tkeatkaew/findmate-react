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
import {
  Filter,
  X,
  Search,
  Heart,
  UserPlus2,
  Bug,
  MessageSquarePlus,
} from "lucide-react";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useTheme, useMediaQuery } from "@mui/material";

import AppTheme from "../AppTheme";

const Discovery = () => {
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

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserTraits, setCurrentUserTraits] = useState(null);
  const [likeStatus, setLikeStatus] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedTraits, setSelectedTraits] = useState({
    type: [],
    sleep: [],
    clean: [],
    smoke: [],
    drink: [],
    period: [],
    gender: [],
  });
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [systemReportDialog, setSystemReportDialog] = useState(false);
  const [reportImage, setReportImage] = useState(null);
  const [reportImagePreview, setReportImagePreview] = useState("");
  const [systemReportType, setSystemReportType] = useState("");
  const [systemDescription, setSystemDescription] = useState("");
  const [isSuggestion, setIsSuggestion] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const traitOptions = {
    gender: [
      { value: "male", label: "ชาย" },
      { value: "female", label: "หญิง" },
    ],
    type: [
      { value: "type_introvert", label: "Introvert" },
      { value: "type_extrovert", label: "Extrovert" },
      { value: "type_ambivert", label: "Ambivert" },
    ],
    sleep: [
      { value: "sleep_before_midnight", label: "ก่อนเที่ยงคืน" },
      { value: "sleep_after_midnight", label: "หลังเที่ยงคืน" },
    ],
    clean: [
      { value: "clean_every_day", label: "ทำความสะอาดทุกวัน" },
      { value: "clean_every_other_day", label: "ทำความสะอาดวันเว้นวัน" },
      { value: "clean_once_a_week", label: "ทำความสะอาดสัปดาห์ละครั้ง" },
    ],
    smoke: [
      { value: "smoke_never", label: "ไม่สูบ" },
      { value: "smoke_spacial", label: "สูบเฉพาะเวลาสังสรรค์" },
      { value: "smoke_always", label: "สูบเป็นประจำ" },
    ],
    drink: [
      { value: "drink_never", label: "ไม่ดื่ม" },
      { value: "drink_spacial", label: "ดื่มเฉพาะโอกาสพิเศษ" },
      { value: "drink_weekend", label: "ดื่มช่วงสุดสัปดาห์" },
      { value: "drink_always", label: "ดื่มเป็นประจำ" },
    ],
    period: [
      { value: "period_long", label: "ต้องการรูมเมทระยะยาว" },
      { value: "period_sometime", label: "ขึ้นอยู่กับสถานการณ์" },
      { value: "period_no_need", label: "ไม่จำเป็น" },
    ],
  };

  const provinces = ["กรุงเทพมหานคร", "กระบี่"];

  const universitiesByProvince = {
    กระบี่: ["มหาวิทยาลัยการกีฬาแห่งชาติ วิทยาเขตกระบี่"],
    แม่ฮ่องสอน: [
      "มหาวิทยาลัยราชภัฏเชียงใหม่ วิทยาเขตแม่ฮ่องสอน",
      "วิทยาลัยชุมชนแม่ฮ่องสอน",
    ],
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

  // ----------------------------------------------------
  // ONLY FETCH ONCE WHEN COMPONENT MOUNTS
  // ----------------------------------------------------
  useEffect(() => {
    // If not logged in, or if admin, redirect.
    // Otherwise fetch the needed data only once.
    if (!user) {
      navigate("/login");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      fetchUsers();
      fetchCurrentUserTraits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ----------------------------------------------------

  const fetchCurrentUserTraits = async () => {
    try {
      const response = await axios.get(`/personalitytraits/${user.id}`);
      setCurrentUserTraits(response.data);
    } catch (err) {
      console.error("Error fetching current user traits:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.post("/knn", { user_id: user.id });
      setUsers(data.neighbors);
      setFilteredUsers(data.neighbors);
      fetchLikeStatuses(data.neighbors);
    } catch (err) {
      console.error("Error fetching users:", err);
      showAlert("เรียกข้อมูลไม่สำเร็จ", "error");
    }
  };

  const fetchLikeStatuses = async (neighbors) => {
    const statuses = {};
    for (const neighbor of neighbors) {
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
  };

  // ----------------------------------
  // FILTER HANDLERS
  // ----------------------------------
  const handleOpenFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    setSelectedUniversity(""); // reset if province changes
  };

  const handleUniversityChange = (event) => {
    setSelectedUniversity(event.target.value);
  };

  const handleTraitChange = (category, value) => {
    setSelectedTraits((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [category]: updated,
      };
    });
  };

  // ---- IMPROVED FILTER FUNCTION ----
  const applyFilters = () => {
    let filtered = [...users];

    // 1) Province Filter (EXACT match)
    if (selectedProvince.trim() !== "") {
      filtered = filtered.filter((u) => {
        // optional chaining in case traits is missing
        const userProvince = u.traits?.province?.trim() || "";
        return userProvince === selectedProvince.trim();
      });
    }

    // 2) University Filter (EXACT match)
    if (selectedUniversity.trim() !== "") {
      filtered = filtered.filter((u) => {
        const userUniversity = u.traits?.university?.trim() || "";
        return userUniversity === selectedUniversity.trim();
      });
    }

    // 3) Trait filters (multiple categories, "OR" logic within each category)
    //    For each category, if user selected any values, we require that
    //    the user’s trait must match at least one of those values.
    Object.entries(selectedTraits).forEach(([category, values]) => {
      // If no values are selected for this category, skip it.
      if (values.length > 0) {
        filtered = filtered.filter((u) => {
          const traitValue = u.traits?.[category];
          if (!traitValue) return false; // user has no data -> exclude

          // If user’s trait is a string (e.g. "type_introvert"):
          if (typeof traitValue === "string") {
            // must be in the "values" array
            return values.includes(traitValue);
          }

          // If user’s trait is an array (e.g. ["type_introvert", "type_extrovert"])
          if (Array.isArray(traitValue)) {
            // check if there's any intersection with selected values
            return traitValue.some((val) => values.includes(val));
          }

          // If it's neither string nor array, fail by default.
          return false;
        });
      }
    });

    setFilteredUsers(filtered);
    handleCloseFilter();
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedProvince("");
    setSelectedUniversity("");
    setSelectedTraits({
      gender: [],
      type: [],
      sleep: [],
      clean: [],
      smoke: [],
      drink: [],
      period: [],
    });
    setFilteredUsers(users);
  };

  // Count total active filters for UI label
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedProvince) count++;
    if (selectedUniversity) count++;
    count += Object.values(selectedTraits).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    return count;
  };

  // ----------------------------------
  // LIKE / REPORT / ETC.
  // ----------------------------------
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

      setLikeStatus((prev) => ({
        ...prev,
        [targetUserId]: !prev[targetUserId],
      }));
      showAlert(
        action === "like" ? "กดถูกใจสำเร็จ!" : "ถอนถูกใจสำเร็จ!",
        "success"
      );
    } catch (err) {
      console.error("Error handling like:", err);
      showAlert("Error processing your request", "error");
    } finally {
      setSelectedUser(null);
    }
  };

  // System / suggestion reports
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

  // Show / hide alerts
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

  return (
    <AppTheme>
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 87px)", // Subtracting navbar height (67px) and margins (2 * 10px)
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: isMobile ? "auto" : "200px",
            height: "95%",
            padding: "0.5rem",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
            borderRadius: "20px",
            margin: "7.5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 0, // Prevent sidebar from shrinking
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
        <Box
          sx={{
            flex: 1,
            padding: "0.5rem",
            overflowY: "auto",
            height: "100%",
          }}
        >
          {/* Header with Filter */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography variant={isMobile ? "h6" : "h4"}>
              ค้นหารูมเมทที่คล้ายคลึงกับคุณ
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                width: isMobile ? "100%" : "auto",
              }}
            >
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearFilters}
                  startIcon={<X size={16} />}
                  fullWidth={isMobile}
                >
                  ตัวกรอง ({getActiveFilterCount()})
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleOpenFilter}
                startIcon={<Filter size={16} />}
                fullWidth={isMobile}
              >
                ตัวกรอง
              </Button>
            </Stack>
          </Box>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleCloseFilter}
            PaperProps={{
              sx: {
                mt: 1,
                maxHeight: "80vh",
                width: "300px",
                overflow: "auto",
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ตัวกรอง
              </Typography>

              {/* Province Filter */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>จังหวัด</InputLabel>
                <Select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  label="จังหวัด"
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {Object.keys(universitiesByProvince).map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* University Filter */}
              <FormControl
                fullWidth
                sx={{ mb: 2 }}
                disabled={!selectedProvince}
              >
                <InputLabel>มหาวิทยาลัย</InputLabel>
                <Select
                  value={selectedUniversity}
                  onChange={handleUniversityChange}
                  label="มหาวิทยาลัย"
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {selectedProvince &&
                    universitiesByProvince[selectedProvince]?.map((uni) => (
                      <MenuItem key={uni} value={uni}>
                        {uni}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              {/* Trait Filters */}
              {Object.entries(traitOptions).map(([category, options]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {/* Customize each category's display name */}
                    {category === "gender"
                      ? "เพศ"
                      : category === "type"
                      ? "บุคลิกภาพ"
                      : category === "sleep"
                      ? "เวลานอน"
                      : category === "clean"
                      ? "ความสะอาด"
                      : category === "smoke"
                      ? "บุหรี่"
                      : category === "drink"
                      ? "แอลกอฮอล์"
                      : "ระยะเวลา"}
                  </Typography>
                  <FormGroup>
                    {options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedTraits[category].includes(
                              option.value
                            )}
                            onChange={() =>
                              handleTraitChange(category, option.value)
                            }
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </FormGroup>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}

              <Button
                fullWidth
                variant="contained"
                onClick={applyFilters}
                sx={{ mt: 2 }}
              >
                นำไปใช้
              </Button>
            </Box>
          </Menu>

          {/* User List */}
          {filteredUsers.length > 0 ? (
            <Box
              sx={{
                maxHeight: "79vh",
                overflowY: "auto",
                paddingRight: "1rem",
                borderRadius: "20px",
              }}
            >
              <Stack spacing={2}>
                {filteredUsers.map((neighbor) => (
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
                    {isMobile ? (
                      // Mobile Layout
                      <Box>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ mb: 2 }}
                        >
                          <img
                            src={
                              neighbor.traits.profile_picture
                                ? `http://localhost:3000${neighbor.traits.profile_picture}`
                                : "http://localhost:3000/uploads/anonymous.jpg"
                            }
                            alt="Profile"
                            style={{
                              width: "75px",
                              height: "75px",
                              borderRadius: "10%",
                              objectFit: "cover",
                            }}
                          />
                          <Box>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {neighbor.traits.nickname || "Anonymous"}
                            </Typography>
                            <Typography variant="subtitle1" color="primary">
                              ความคล้าย {neighbor.similarity}%
                            </Typography>
                          </Box>
                        </Stack>
                        <Grid container>
                          {["type", "clean", "drink", "smoke"].map((key) => (
                            <Grid item xs={12} key={key}>
                              <Typography variant="body2">
                                <strong>{labelMapping[key] || key}:</strong>{" "}
                                {valueMapping[neighbor.traits[key]] ||
                                  neighbor.traits[key]}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ) : (
                      // Desktop Layout (unchanged)
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <img
                            src={
                              neighbor.traits.profile_picture
                                ? `http://localhost:3000${neighbor.traits.profile_picture}`
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
                              {neighbor.traits.nickname || "Anonymous"} -{" "}
                              ความคล้าย {neighbor.similarity}%
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
                                <strong>{labelMapping[key] || key}:</strong>{" "}
                                {valueMapping[neighbor.traits[key]] ||
                                  neighbor.traits[key]}
                              </Typography>
                            ))}
                          </Box>
                        </Stack>
                      </Stack>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Box>
          ) : (
            <Typography variant="body1">
              ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
            </Typography>
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
              top: "47%",
              left: "46%",
              transform: "translate(-50%, -50%)",
              width: { xs: "80%", sm: "80%", md: "65%" },
              minWidth: { xs: "auto", sm: "500px" },
              maxHeight: "75vh",
              overflow: "auto",
              backgroundColor: "white",
              padding: { xs: "1rem", sm: "2.5rem" },
              boxShadow: 24,
              borderRadius: "20px",
              margin: { xs: "1rem", sm: "2rem" },
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
                  selectedUser.traits.profile_picture
                    ? `http://localhost:3000${selectedUser.traits.profile_picture}`
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
                  {selectedUser.traits.nickname || "Anonymous"}
                </Typography>
                <Typography variant="subtitle1">
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
                  <strong>ค่าหอพักต่อเดือน:</strong>{" "}
                  {selectedUser.traits.monthly_dorm_fee
                    ? `฿${selectedUser.traits.monthly_dorm_fee.toLocaleString()}`
                    : "ไม่ระบุ"}
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
                  <strong>ข้อความเพิ่มเติม:</strong>{" "}
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
              {Object.entries(selectedUser.traits).map(([key, value]) => {
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
                color={likeStatus[selectedUser.user_id] ? "error" : "primary"}
                onClick={() => handleLike(selectedUser.user_id)}
              >
                {likeStatus[selectedUser.user_id] ? "ถอนถูกใจ" : "ถูกใจ"}
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

export default Discovery;
