import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import UploadPrescription from "./pages/UploadPrescription";
import ReminderPage from "./pages/ReminderPage";
import UpcomingReminders from "./pages/UpcomingReminders";
import Register from "./pages/Register"; // ✅ Add this
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <ToastContainer /> {/* ✅ Toast system active */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<PrescriptionUpload />} />
        <Route path="/upload-prescription" element={<UploadPrescription />} />
        <Route path="/upcoming-reminders" element={<UpcomingReminders />} />
        <Route path="/set-reminder" element={<ReminderPage />} />
        <Route path="/register" element={<Register />} />{" "}
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/upcoming-reminders"
          element={<UpcomingReminders />}
        />{" "}
        {/* ✅ Use this path only */}
      </Routes>
    </Router>
  );
}

export default App;
