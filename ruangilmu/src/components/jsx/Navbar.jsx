// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo ruangilmu.svg';

const Navbar = () => {
  return (
    <nav className="container mx-auto px-6 py-10 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="RuangIlmu Logo" className="h-10" />
        <span className="text-2xl font-extrabold text-[#026078]">RuangIlmu</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-800 font-medium hover:text-blue-600">Beranda</Link>
        <Link to="/course" className="text-gray-600 hover:text-blue-600">Kelas</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link 
          to="/login" 
          className="bg-white text-[#0B7077] px-7 py-3 rounded-md hover:bg-gray-100 transition"
        >
          LOG IN
        </Link>
        <Link 
          to="/register" 
          className="bg-[#0B7077] text-white px-7 py-3 rounded-md hover:bg-[#014b60] transition"
        >
          SIGN UP
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;