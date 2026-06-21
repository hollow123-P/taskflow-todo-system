import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Collab from "./pages/Collab";
import Report from "./pages/Report";

// 未登入導回登入頁
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>載入中...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* 四大模組對應路由 */}
      <Route path="/task" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/collab" element={<PrivateRoute><Collab /></PrivateRoute>} />
      <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
      {/* 首頁預設跳任務看板 */}
      <Route path="/" element={<Navigate to="/task" />} />
    </Routes>
  );
}

export default App;