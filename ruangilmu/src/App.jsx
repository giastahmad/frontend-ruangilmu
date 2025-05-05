import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Course from './pages/Course';
import CourseDetailPage from "./pages/CourseDetail";
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
        {/* Tambahkan route lain sesuai kebutuhan */}
      </Routes>
    </Router>
  );
}

export default App;
