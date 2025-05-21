import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Course from './pages/Course';
import CourseDetailPage from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import QuizApp from "./pages/Quiz";
import Modul from "./pages/Modul";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Verify" element={<Verify />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit_profile" element={<EditProfile />} />
        <Route path="/quiz/:courseid/:moduleid" element={<QuizApp />} />
        <Route path="/modul/:id" element={<Modul />} />
      </Routes>
    </Router>
  );
}

export default App;
