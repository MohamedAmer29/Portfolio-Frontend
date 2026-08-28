import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LoginPage } from "./pages/LoginPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { SessionExtensionBanner } from "./components/SessionExtensionBanner";
import { AdminAuthBadge } from "./components/admin/AdminAuthBadge";
import { AdminHealthPanel } from "./components/admin/AdminHealthPanel";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      <SessionExtensionBanner />
      <AdminAuthBadge />
      <AdminHealthPanel />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
