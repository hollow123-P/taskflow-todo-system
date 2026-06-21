import { useEffect, useState } from "react";
import { Box, Toolbar, Typography, Paper, Grid, Button, Chip } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

const drawerWidth = 220;

export default function Report() {
  const [taskData, setTaskData] = useState([]);
  const [stat, setStat] = useState({ high: 0, mid: 0, low: 0, total: 0 });
  const user = auth.currentUser;

  // 載入任務並統計數據
  const loadData = async () => {
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const res = await getDocs(q);
    const list = res.docs.map(d => ({ id: d.id, ...d.data() }));
    setTaskData(list);

    let high = 0, mid = 0, low = 0;
    list.forEach(t => {
      if (t.priority === "高") high++;
      else if (t.priority === "中") mid++;
      else low++;
    });
    setStat({ high, mid, low, total: list.length });
  };

  useEffect(() => {
    loadData();
  }, []);

  // 模擬匯出報表
  const exportCSV = () => {
    alert("已匯出本使用者專案進度報表 CSV");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">權限與數據｜個人專案進度報表</Typography>
          <Button variant="outlined" onClick={exportCSV}>匯出報表</Button>
        </Box>

        {/* 統計卡片 */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">全部任務</Typography>
              <Typography fontSize={30} fontWeight="bold">{stat.total}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">高優先級</Typography>
              <Typography fontSize={30} fontWeight="bold" color="red">{stat.high}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">中優先級</Typography>
              <Typography fontSize={30} fontWeight="bold" color="orange">{stat.mid}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">低優先級</Typography>
              <Typography fontSize={30} fontWeight="bold" color="green">{stat.low}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 使用者權限說明 */}
        <Typography variant="h6" gutterBottom>帳號權限說明</Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography>當前登入帳號：{user.email}</Typography>
          <Typography>權限等級：一般使用者（僅可讀寫自身建立的所有任務，無法檢視其他使用者資料）</Typography>
          <Chip label="資料隔離保護開啟" color="success" sx={{ mt: 1 }} />
        </Paper>

        {/* 全部任務清單 */}
        <Typography variant="h6">所有待辦紀錄</Typography>
        {taskData.length === 0 ? (
          <Typography>尚無任何任務資料</Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {taskData.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography fontWeight="bold">{item.title}</Typography>
                  <Typography fontSize="14">{item.content}</Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Chip label={item.priority} size="small" color={item.priority === "高" ? "error" : item.priority === "中" ? "warning" : "success"} />
                    <Chip label={item.deadline} size="small" variant="outlined" />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}