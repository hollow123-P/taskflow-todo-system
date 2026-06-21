import { Drawer, List, ListItem, ListItemText, Toolbar, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import ChatIcon from "@mui/icons-material/Chat";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {/* 1. 任務管理 / 進度看板 */}
        <ListItem button onClick={() => navigate("/task")}>
          <ListItemIcon><TaskIcon /></ListItemIcon>
          <ListItemText primary="任務管理" />
        </ListItem>
        {/* 2. 協作溝通頁 */}
        <ListItem button onClick={() => navigate("/collab")}>
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary="協作溝通" />
        </ListItem>
        {/* 3. 進度可視（同任務管理頁） */}
        <ListItem button onClick={() => navigate("/task")}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="進度可視 / 任務看板" />
        </ListItem>
        {/* 4. 權限與數據報表頁 */}
        <ListItem button onClick={() => navigate("/report")}>
          <ListItemIcon><LockIcon /></ListItemIcon>
          <ListItemText primary="權限與數據報表" />
        </ListItem>
      </List>
    </Drawer>
  );
}