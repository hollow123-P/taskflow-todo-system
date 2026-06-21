import { useState, useEffect } from "react";
import { Box, Toolbar, Typography, TextField, Button, Paper, Avatar, Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, getDocs, orderBy, query, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const drawerWidth = 220;

export default function Collab() {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [nickname, setNickname] = useState("");
  const messageRef = collection(db, "messages");

  // 編輯彈窗狀態
  const [editOpen, setEditOpen] = useState(false);
  const [editMsgId, setEditMsgId] = useState("");
  const [editText, setEditText] = useState("");

  // 載入當前使用者暱稱
  const loadUserNickname = async () => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if(userDoc.exists()) {
      const data = userDoc.data();
      setNickname(data.nickname);
    }
  };

  // 載入全部團隊留言
  const loadAllMessages = async () => {
    const q = query(messageRef, orderBy("time", "asc"));
    const snapshot = await getDocs(q);
    const allMsg = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessageList(allMsg);
  };

  useEffect(() => {
    loadUserNickname();
    loadAllMessages();
  }, []);

  // 發送留言
  const sendMessage = async () => {
    if (!msg.trim()) return alert("請輸入留言內容");

    await addDoc(messageRef, {
      uid: user.uid,
      userName: nickname,
      text: msg,
      time: new Date().toLocaleString()
    });

    setMsg("");
    loadAllMessages();
  };

  // 打開編輯視窗，僅自己留言可觸發
  const openEditModal = (item) => {
    setEditMsgId(item.id);
    setEditText(item.text);
    setEditOpen(true);
  };

  // 儲存編輯留言
  const saveEditMsg = async () => {
    if(!editText.trim()) return alert("內容不可空白");
    const msgDoc = doc(db, "messages", editMsgId);
    await updateDoc(msgDoc, {
      text: editText,
      editTime: new Date().toLocaleString()
    });
    setEditOpen(false);
    loadAllMessages();
  };

  // 刪除自己的留言
  const deleteMessage = async (msgId) => {
    if(window.confirm("確定刪除此則留言？")){
      await deleteDoc(doc(db, "messages", msgId));
      loadAllMessages();
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>協作溝通｜團隊共用留言板</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          所有使用者可互相檢視留言；僅能編輯、刪除自己發布的訊息
        </Typography>

        <Paper sx={{ p: 2, height: 420, overflowY: "auto", mb: 3 }}>
          <Stack spacing={2}>
            {messageList.length === 0 ? (
              <Typography align="center" color="gray">目前尚無團隊討論，發送第一則留言開始協作</Typography>
            ) : (
              messageList.map((item) => (
                <Box key={item.id}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{item.userName.charAt(0).toUpperCase()}</Avatar>
                    <Box flexGrow={1}>
                      <Typography fontWeight="bold">{item.userName}</Typography>
                      <Typography fontSize="12" color="gray">{item.time}</Typography>
                    </Box>
                    {/* 只有留言發布者本人顯示編輯、刪除按鈕 */}
                    {item.uid === user.uid && (
                      <Box>
                        <IconButton size="small" onClick={()=>openEditModal(item)} color="primary">
                          <EditIcon fontSize="small"/>
                        </IconButton>
                        <IconButton size="small" onClick={()=>deleteMessage(item.id)} color="error">
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ pl: 7, mt: 0.5 }}>{item.text}</Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))
            )}
          </Stack>
        </Paper>

        {/* 發送留言輸入列 */}
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="輸入討論、備註、檔案協調內容"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>傳送留言</Button>
        </Box>

        {/* 編輯留言彈窗 */}
        <Dialog open={editOpen} onClose={()=>setEditOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>修改留言</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="留言內容"
              value={editText}
              onChange={(e)=>setEditText(e.target.value)}
              sx={{ mt:1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setEditOpen(false)}>取消</Button>
            <Button variant="contained" onClick={saveEditMsg}>儲存修改</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}