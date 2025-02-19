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

import AppTheme from "../AppTheme";
import axios from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
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
  const [selectedAction, setSelectedAction] = useState("");
  const [actionReason, setActionReason] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    const initializeDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        if (user.role !== "admin") {
          navigate("/discovery");
          return;
        }

        if (isSubscribed) {
          // Reset states
          setStats({
            totalUsers: 0,
            totalMatches: 0,
            totalReports: 0,
          });
          setUserReports([]);
          setSystemReports([]);
          setSuggestions([]);
          setSelectedReport(null);
          setAlert({
            open: false,
            message: "",
            severity: "success",
          });
          setReportDialog(false);
          setActionDialogOpen(false);
          setSelectedAction("");
          setActionReason("");

          // Fetch data
          await Promise.all([fetchStats(), fetchReports()]);
        }
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        if (isSubscribed) {
          setAlert({
            open: true,
            message: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            severity: "error",
          });
        }
      }
    };

    initializeDashboard();

    return () => {
      isSubscribed = false;
    };
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
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
      throw error;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
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

  const handleUserAction = async (action) => {
    try {
      if (!selectedReport) return;

      await axios.post(
        `/admin/user-action/${selectedReport.reported_user_id}`,
        {
          action,
          reason: actionReason,
          report_id: selectedReport.id,
        }
      );

      setAlert({
        open: true,
        message: "การดำเนินการเสร็จสิ้น",
        severity: "success",
      });

      fetchReports();
      setActionDialogOpen(false);
      setActionReason("");
      setSelectedAction("");
    } catch (error) {
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
      <Box
        sx={{
          display: "flex",
          minHeight: "90vh",
          position: "relative",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            padding: "1rem",
            position: "relative",
            zIndex: 1,
            overflow: "auto",
          }}
        >
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
                              <Button
                                variant="contained"
                                size="small"
                                color={
                                  report.is_suspended ? "primary" : "error"
                                }
                                onClick={() => {
                                  setSelectedReport(report);
                                  setSelectedAction(
                                    report.is_suspended
                                      ? "unsuspend"
                                      : "suspend"
                                  );
                                  setActionDialogOpen(true);
                                }}
                              >
                                {report.is_suspended
                                  ? "ยกเลิกระงับ"
                                  : "ระงับการใช้งาน"}
                              </Button>
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
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Report Detail Dialog */}
      <Dialog
        open={reportDialog}
        onClose={() => setReportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายละเอียดรายงาน</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
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
        </DialogContent>
        <DialogActions>
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

      {/* Action Dialog */}
      <Dialog
        open={actionDialogOpen}
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
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              multiline
              rows={4}
              label="เหตุผล"
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>ยกเลิก</Button>
          <Button
            onClick={() => handleUserAction(selectedAction)}
            variant="contained"
            color={selectedAction === "suspend" ? "error" : "primary"}
            disabled={!actionReason}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
};

export default AdminDashboard;
