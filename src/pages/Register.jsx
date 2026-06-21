import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // 新增暱稱狀態

  const handleRegister = async () => {
    if(!nickname.trim()) return alert("請填寫暱稱（留言板顯示名稱）");
    if(!email || !password) return alert("信箱與密碼必填");
    try {
      // 建立帳號
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      // 使用者資料存入Firebase，存暱稱
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nickname: nickname
      });
      alert("註冊成功，請登入");
      navigate("/login");
    } catch (err) {
      alert("註冊失敗：" + err.message);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper sx={{ p:4, width:400 }}>
        <Typography variant="h5" gutterBottom align="center">會員註冊</Typography>
        {/* 暱稱欄位 */}
        <TextField
          label="暱稱（留言板顯示名稱）"
          fullWidth
          margin="normal"
          value={nickname}
          onChange={(e)=>setNickname(e.target.value)}
        />
        <TextField
          label="電子信箱"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <TextField
          label="密碼"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt:2 }}
          onClick={handleRegister}
        >
          完成註冊
        </Button>
        <Button
          fullWidth
          sx={{ mt:1 }}
          onClick={()=>navigate("/login")}
        >
          已有帳號？前往登入
        </Button>
      </Paper>
    </Box>
  );
}