import { Card, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function TaskCard({ task, onDelete, openEdit }) {
  const priorityColor = task.priority === "高" ? "error" : task.priority === "中" ? "warning" : "success";

  return (
    <Card sx={{ mb:2, minWidth:260 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <Box>
            {/* 編輯按鈕 */}
            <IconButton onClick={() => openEdit(task)} color="primary">
              <EditIcon />
            </IconButton>
            {/* 刪除按鈕 */}
            <IconButton onClick={()=>onDelete(task.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography color="text.secondary">{task.content}</Typography>
        <Box sx={{ mt:1, display:"flex", gap:1 }}>
          <Chip label={`優先級:${task.priority}`} color={priorityColor} size="small"/>
          <Chip label={`截止日:${task.deadline}`} variant="outlined" size="small"/>
        </Box>
      </CardContent>
    </Card>
  );
}