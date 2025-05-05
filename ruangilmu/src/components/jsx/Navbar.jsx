// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo ruangilmu.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="container mx-auto px-6 md:px-24 py-6 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="RuangIlmu Logo" className="h-8 md:h-10" />
        <span className="text-xl md:text-2xl font-extrabold text-[#026078]">RuangIlmu</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-800 font-medium hover:text-blue-600">Beranda</Link>
        <Link to="/course" className="text-gray-600 hover:text-blue-600">Kelas</Link>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Link 
          to="/login" 
          className="bg-white text-[#0B7077] px-7 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Masuk
        </Link>
        <Link 
          to="/register" 
          className="bg-[#0B7077] text-white px-7 py-3 rounded-md hover:bg-[#014b60] transition"
        >
          Daftar
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 right-4 w-48 bg-white rounded-md shadow-lg py-2 z-10 md:hidden">
          <Link 
            to="/" 
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link 
            to="/course" 
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Kelas
          </Link>
          <div className="border-t border-gray-200 my-2"></div>
          <Link 
            to="/login" 
            className="block px-4 py-2 text-[#0B7077] hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Masuk
          </Link>
          <Link 
            to="/register" 
            className="block px-4 py-2 text-[#0B7077] font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Daftar
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;