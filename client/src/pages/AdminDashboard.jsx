import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";

import AppTheme from "../AppTheme";
import axios from "../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalReports: 0,
  });
  const [userReports, setUserReports] = useState([]);
  const [systemReports, setSystemReports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [reportDialog, setReportDialog] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [actionReason, setActionReason] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin/users");
      setUsers(response.data.filter((user) => user.role !== "admin"));
    } catch (error) {
      console.error("Error fetching users:", error);
      setAlert({
        open: true,
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
        severity: "error",
      });
    }
  };

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    } else if (user.role !== "admin") {
      navigate("/discovery"); // Redirect non-admin users
    } else {
      fetchStats();
      fetchReports();
      fetchUsers();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

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

  const fetchReports = async () => {
    try {
      const [userReportsRes, systemReportsRes, suggestionsRes] =
        await Promise.all([
          axios.get("/admin/user-reports"),
          axios.get("/admin/system-reports"),
          axios.get("/admin/suggestions"),
        ]);
      setUserReports(userReportsRes.data);
      setSystemReports(systemReportsRes.data);
      setSuggestions(suggestionsRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const [userInfo, traits, userData] = await Promise.all([
        axios.get(`/personalinfo/${userId}`),
        axios.get(`/personalitytraits/${userId}`),
        axios.get(`/admin/users/${userId}`), // Add this to get user data including profile picture
      ]);
      return {
        info: userInfo.data,
        traits: traits.data,
        profile: userData.data,
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewReport = async (report) => {
    setSelectedReport(report);
    if (report.reported_user_id) {
      const userDetails = await fetchUserDetails(report.reported_user_id);
      if (userDetails) {
        setSelectedReport((prev) => ({
          ...prev,
          userDetails,
        }));
      }
    }
    setReportDialog(true);
  };

  const handleReportAction = async (action) => {
    try {
      await axios.post(`/admin/reports/${selectedReport.id}/action`, {
        action,
      });
      setAlert({
        open: true,
        message: "Report updated successfully",
        severity: "success",
      });
      setReportDialog(false);
      fetchReports();
    } catch (error) {
      setAlert({
        open: true,
        message: "Error updating report",
        severity: "error",
      });
    }
  };

  const handleUserAction = async () => {
    try {
      if (!selectedUser && !selectedReport) return;

      // If coming from a report
      if (selectedReport) {
        await axios.post(
          `/admin/user-action/${selectedReport.reported_user_id}`,
          {
            action: selectedAction,
            reason: actionReason,
            report_id: selectedReport.id,
          }
        );
      }
      // If coming from user management
      else if (selectedUser) {
        if (selectedAction === "delete") {
          await axios.delete(`/admin/users/${selectedUser.id}`);
        } else {
          await axios.post(`/admin/user-action/${selectedUser.id}`, {
            action: selectedAction,
            reason: actionReason,
          });
        }
      }

      setAlert({
        open: true,
        message: "ดำเนินการสำเร็จ",
        severity: "success",
      });

      // Refresh data
      fetchUsers();
      fetchReports();
      setActionDialogOpen(false);
      setActionReason("");
      setSelectedAction("");
      setSelectedReport(null);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        open: true,
        message: "เกิดข้อผิดพลาดในการดำเนินการ",
        severity: "error",
      });
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(`/admin/reports/${reportId}`);
      setAlert({
        open: true,
        message: "ลบรายงานเรียบร้อยแล้ว",
        severity: "success",
      });
      fetchReports();
    } catch (error) {
      setAlert({
        open: true,
        message: "เกิดข้อผิดพลาดในการลบรายงาน",
        severity: "error",
      });
    }
  };

  return (
    <AppTheme>
      <Box sx={{ display: "flex", minHeight: "90vh" }}>
        {/* Main Content */}
        <Box sx={{ flex: 1, padding: "1rem" }}>
          <Typography variant="h4" gutterBottom>
            แดชบอร์ดผู้ดูแลระบบ
          </Typography>

          {/* Statistics Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              mb: 3,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">{stats.totalUsers}</Typography>
                <Typography color="textSecondary">
                  จำนวนผู้ใช้ทั้งหมด
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">{stats.totalMatches}</Typography>
                <Typography color="textSecondary">
                  จำนวนการจับคู่ทั้งหมด
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">{stats.totalReports}</Typography>
                <Typography color="textSecondary">
                  จำนวนรายงานทั้งหมด
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Reports Tabs */}
          <Paper sx={{ width: "100%", mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="รายงานผู้ใช้" />
              <Tab label="รายงานระบบ" />
              <Tab label="ข้อเสนอแนะ" />
              <Tab label="จัดการผู้ใช้ทั้งหมด" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ผู้รายงาน</TableCell>
                        <TableCell>ผู้ถูกรายงาน</TableCell>
                        <TableCell>ประเภท</TableCell>
                        <TableCell>สถานะ</TableCell>
                        <TableCell>วันที่</TableCell>
                        <TableCell>การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.reporter_name}</TableCell>
                          <TableCell>
                            {report.reported_user_name}
                            {report.is_suspended && (
                              <Chip
                                label="ถูกระงับการใช้งาน"
                                color="error"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.status}</TableCell>
                          <TableCell>
                            {new Date(report.created_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewReport(report)}
                              >
                                ดูรายละเอียด
                              </Button>
                              {!report.is_suspended && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setSelectedAction("suspend");
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  ระงับการใช้งาน
                                </Button>
                              )}
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => handleDeleteReport(report.id)}
                              >
                                ลบรายงาน
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ผู้รายงาน</TableCell>
                        <TableCell>ประเภท</TableCell>
                        <TableCell>คำอธิบาย</TableCell>
                        <TableCell>สถานะ</TableCell>
                        <TableCell>วันที่</TableCell>
                        <TableCell>การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {systemReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.reporter_name}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.description}</TableCell>
                          <TableCell>{report.status}</TableCell>
                          <TableCell>
                            {new Date(report.created_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewReport(report)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 2 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ผู้เสนอแนะ</TableCell>
                        <TableCell>ข้อเสนอแนะ</TableCell>
                        <TableCell>วันที่</TableCell>
                        <TableCell>สถานะ</TableCell>
                        <TableCell>การจัดการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {suggestions.map((suggestion) => (
                        <TableRow key={suggestion.id}>
                          <TableCell>{suggestion.user_name}</TableCell>
                          <TableCell>{suggestion.content}</TableCell>
                          <TableCell>
                            {new Date(suggestion.created_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </TableCell>
                          <TableCell>{suggestion.status}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewReport(suggestion)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 3 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ชื่อผู้ใช้</TableCell>
                        <TableCell>อีเมล</TableCell>
                        <TableCell>สถานะ</TableCell>
                        <TableCell>มหาวิทยาลัย</TableCell>
                        <TableCell>การดำเนินการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.is_suspended ? (
                              <Chip
                                label="ถูกระงับ"
                                color="error"
                                size="small"
                              />
                            ) : (
                              <Chip
                                label="ใช้งานปกติ"
                                color="success"
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell>{user.universities}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                color={user.is_suspended ? "primary" : "error"}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedAction(
                                    user.is_suspended ? "unsuspend" : "suspend"
                                  );
                                  setActionDialogOpen(true);
                                }}
                              >
                                {user.is_suspended
                                  ? "ยกเลิกระงับ"
                                  : "ระงับการใช้งาน"}
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedAction("delete");
                                  setActionDialogOpen(true);
                                }}
                              >
                                ลบบัญชี
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Report Detail Dialog */}
      <Dialog
        open={reportDialog}
        onClose={() => setReportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>รายละเอียดรายงาน</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ข้อมูลการรายงาน
              </Typography>
              <Stack spacing={2}>
                <Typography>
                  <strong>ประเภท:</strong> {selectedReport?.type}
                </Typography>
                <Typography>
                  <strong>คำอธิบาย:</strong> {selectedReport?.description}
                </Typography>
                {selectedReport?.image && (
                  <img
                    src={selectedReport.image}
                    alt="Report"
                    style={{ width: "100%", borderRadius: "4px" }}
                  />
                )}
              </Stack>
            </Box>

            {selectedReport?.userDetails && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  ข้อมูลผู้ถูกรายงาน
                </Typography>
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={
                              selectedReport.profile_picture ||
                              "/uploads/anonymous.jpg"
                            }
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <Stack spacing={1}>
                          <Typography variant="h6">
                            {selectedReport.reported_user_name}
                            {selectedReport.is_suspended && (
                              <Chip
                                label="ถูกระงับการใช้งาน"
                                color="error"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Typography color="textSecondary">
                            {selectedReport.userDetails.info.university}
                          </Typography>
                        </Stack>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Stack spacing={2}>
                        <Typography>
                          <strong>ชื่อ-นามสกุล:</strong>{" "}
                          {selectedReport.userDetails.info.firstname}{" "}
                          {selectedReport.userDetails.info.lastname}
                        </Typography>
                        <Typography>
                          <strong>ชื่อเล่น:</strong>{" "}
                          {selectedReport.userDetails.info.nickname}
                        </Typography>
                        <Typography>
                          <strong>อายุ:</strong>{" "}
                          {selectedReport.userDetails.info.age}
                        </Typography>
                        <Typography>
                          <strong>เพศ:</strong>{" "}
                          {traitOptions.gender.find(
                            (option) =>
                              option.value ===
                              selectedReport.userDetails.info.gender
                          )?.label || selectedReport.userDetails.info.gender}
                        </Typography>
                        <Typography>
                          <strong>จังหวัด:</strong>{" "}
                          {selectedReport.userDetails.info.province}
                        </Typography>
                        <Typography>
                          <strong>สถานภาพ:</strong>{" "}
                          {selectedReport.userDetails.info.maritalstatus}
                        </Typography>
                        <Typography>
                          <strong>LGBT:</strong>{" "}
                          {selectedReport.userDetails.info.lgbt
                            ? "ใช่"
                            : "ไม่ใช่"}
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1">
                          <strong>ข้อมูลการติดต่อ</strong>
                        </Typography>
                        <Typography>
                          <strong>เบอร์โทร:</strong>{" "}
                          {selectedReport.userDetails.info.phone || "-"}
                        </Typography>
                        <Typography>
                          <strong>Facebook:</strong>{" "}
                          {selectedReport.userDetails.info.facebook || "-"}
                        </Typography>
                        <Typography>
                          <strong>Instagram:</strong>{" "}
                          {selectedReport.userDetails.info.instagram || "-"}
                        </Typography>
                        <Typography>
                          <strong>Line ID:</strong>{" "}
                          {selectedReport.userDetails.info.line_id || "-"}
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1">
                          <strong>ข้อมูลที่พัก</strong>
                        </Typography>
                        <Typography>
                          <strong>ชื่อหอพัก:</strong>{" "}
                          {selectedReport.userDetails.info.dorm_name || "-"}
                        </Typography>
                        <Typography>
                          <strong>ค่าหอพักต่อเดือน:</strong>{" "}
                          {selectedReport.userDetails.info.monthly_dorm_fee
                            ? `${selectedReport.userDetails.info.monthly_dorm_fee} บาท`
                            : "-"}
                        </Typography>
                        <Typography>
                          <strong>ยานพาหนะ:</strong>{" "}
                          {selectedReport.userDetails.info.vehicle || "-"}
                        </Typography>
                        <Divider />
                        <Typography>
                          <strong>แนะนำตัว:</strong>
                        </Typography>
                        <Typography sx={{ whiteSpace: "pre-line" }}>
                          {selectedReport.userDetails.info.self_introduction ||
                            "-"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          {!selectedReport?.is_suspended && (
            <Button
              onClick={() => {
                setSelectedAction("suspend");
                setActionDialogOpen(true);
                setReportDialog(false);
              }}
              variant="contained"
              color="error"
            >
              ระงับการใช้งาน
            </Button>
          )}
          <Button
            onClick={() => handleReportAction("resolved")}
            variant="contained"
            color="primary"
          >
            แก้ไขแล้ว
          </Button>
          <Button
            onClick={() => handleReportAction("rejected")}
            variant="outlined"
            color="error"
          >
            ปฏิเสธ
          </Button>
          <Button onClick={() => setReportDialog(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
      {/* Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={actionDialogOpen && selectedAction !== "delete"}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedAction === "suspend"
            ? "ระงับการใช้งานบัญชี"
            : "ยกเลิกการระงับการใช้งานบัญชี"}
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            label="เหตุผล"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>ยกเลิก</Button>
          <Button
            onClick={handleUserAction}
            variant="contained"
            color={selectedAction === "suspend" ? "error" : "primary"}
            disabled={!actionReason}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={actionDialogOpen && selectedAction === "delete"}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ยืนยันการลบบัญชี</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            การดำเนินการนี้ไม่สามารถเรียกคืนได้ และข้อมูลทั้งหมดจะถูกลบถาวร
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>ยกเลิก</Button>
          <Button onClick={handleUserAction} variant="contained" color="error">
            ยืนยันการลบ
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default AdminDashboard;
