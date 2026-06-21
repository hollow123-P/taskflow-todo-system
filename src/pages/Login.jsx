import { Box, Button, TextField, Paper, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("登入失敗："+err.message);
    }
  };

  return (
    <Box sx={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Paper sx={{ p:4, width:380 }}>
        <Typography variant="h4" gutterBottom>登入系統</Typography>
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <TextField fullWidth label="密碼" type="password" margin="normal" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <Button fullWidth variant="contained" sx={{ mt:2 }} onClick={handleLogin}>登入</Button>
        {/* 這一行修正：補上缺少的 ) */}
        <Button fullWidth sx={{ mt:1 }} onClick={()=>navigate("/register")}>沒有帳號？註冊</Button>
      </Paper>
    </Box>
  );
}