import { useState, useEffect } from "react";
import { Box, Toolbar, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";

const drawerWidth = 220;

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("中");
  const [deadline, setDeadline] = useState("");
  const user = auth.currentUser;

  // 編輯彈窗狀態
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPriority, setEditPriority] = useState("中");
  const [editDeadline, setEditDeadline] = useState("");

  // 載入使用者專屬任務
  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const res = await getDocs(q);
    const list = res.docs.map(d => ({ id:d.id, ...d.data() }));
    setTasks(list);
  };

  useEffect(()=>{
    fetchTasks();
  }, []);

  // 新增任務
  const addTask = async () => {
    if(!title || !deadline) return alert("標題與截止日必填");
    await addDoc(collection(db, "tasks"), {
      title, content, priority, deadline, uid: user.uid
    });
    setTitle(""); setContent(""); setDeadline(""); setPriority("中");
    fetchTasks();
  };

  // 刪除任務
  const delTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  // 開啟編輯視窗，帶入原始資料
  const openEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditContent(task.content);
    setEditPriority(task.priority);
    setEditDeadline(task.deadline);
    setEditOpen(true);
  };

  // 儲存修改內容
  const saveEdit = async () => {
    if(!editTitle || !editDeadline) return alert("標題與截止日必填");
    const taskRef = doc(db, "tasks", editId);
    await updateDoc(taskRef, {
      title: editTitle,
      content: editContent,
      priority: editPriority,
      deadline: editDeadline
    });
    setEditOpen(false);
    fetchTasks();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow:1, p:3, ml:`${drawerWidth}px` }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>建立新任務</Typography>
        
        <Grid container spacing={2} sx={{ mb:4 }}>
          <Grid item xs={12} md={3}>
            <TextField 
              label="任務標題" 
              fullWidth 
              variant="outlined"
              value={title} 
              onChange={(e)=>setTitle(e.target.value)} 
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField 
              label="內容備註" 
              fullWidth 
              variant="outlined"
              value={content} 
              onChange={(e)=>setContent(e.target.value)} 
            />
          </Grid>
          {/* 優先級原始標準結構 */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>優先級</InputLabel>
              <Select value={priority} label="優先級" onChange={(e)=>setPriority(e.target.value)}>
                <MenuItem value="高">高</MenuItem>
                <MenuItem value="中">中</MenuItem>
                <MenuItem value="低">低</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 截止日：標籤縮小、貼左上角、內文下移避開重疊 */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel
                sx={{
                  fontSize: "0.7rem",
                  top: "2px",
                  left: "8px",
                  transformOrigin: "top left",
                  transform: "translate(0, 0) scale(1)"
                }}
              >
                截止日
              </InputLabel>
              <TextField
                type="datetime-local"
                fullWidth
                value={deadline}
                onChange={(e)=>setDeadline(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    paddingTop: "18px",
                    paddingLeft: "6px"
                  }
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button variant="contained" fullWidth sx={{ height:"100%" }} onClick={addTask}>新增任務</Button>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>我的待辦清單</Typography>
        <Grid container spacing={2}>
          {tasks.map(item=>(
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <TaskCard task={item} onDelete={delTask} openEdit={openEdit} />
            </Grid>
          ))}
        </Grid>

        {/* 編輯彈窗 Dialog */}
        <Dialog open={editOpen} onClose={()=>setEditOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>修改任務</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt:1 }}>
              <Grid item xs={12}>
                <TextField label="任務標題" fullWidth variant="outlined" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="內容備註" fullWidth variant="outlined" value={editContent} onChange={(e)=>setEditContent(e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>優先級</InputLabel>
                  <Select value={editPriority} label="優先級" onChange={(e)=>setEditPriority(e.target.value)}>
                    <MenuItem value="高">高</MenuItem>
                    <MenuItem value="中">中</MenuItem>
                    <MenuItem value="低">低</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    sx={{
                      fontSize: "0.7rem",
                      top: "2px",
                      left: "8px",
                      transformOrigin: "top left",
                      transform: "translate(0, 0) scale(1)"
                    }}
                  >
                    截止日
                  </InputLabel>
                  <TextField
                    type="datetime-local"
                    fullWidth
                    value={editDeadline}
                    onChange={(e)=>setEditDeadline(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        paddingTop: "18px",
                        paddingLeft: "6px"
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setEditOpen(false)}>取消</Button>
            <Button variant="contained" onClick={saveEdit}>儲存修改</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}