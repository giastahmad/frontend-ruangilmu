// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../img/logo ruangilmu.svg';
import PopupModal from './Popup';

const Navbar = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State untuk mengontrol popup
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi untuk membuka popup konfirmasi
  const openLogoutConfirmation = () => {
    setIsPopupOpen(true);
  };

  // Fungsi untuk menutup popup
  const closeLogoutConfirmation = () => {
    setIsPopupOpen(false);
  };

  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    // Show success toast
    const toast = document.getElementById('successToast');
    if (toast) {
      toast.innerText = 'Logout Successful!';
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }

    // Redirect to homepage and refresh
    navigate('/', { replace: true });
    window.location.reload();
  };

  // Fungsi untuk menentukan apakah link sedang aktif
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="container mx-auto px-6 md:px-24 py-6 flex justify-between items-center bg-[#d2e6e4]">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="RuangIlmu Logo" className="h-8 md:h-10" />
          <span className="text-xl md:text-2xl font-extrabold text-[#026078]">RuangIlmu</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-medium hover:text-blue-600 transition-colors ${isActiveLink('/')
                ? 'text-[#026078] font-semibold border-b-2 border-[#026078] pb-1'
                : 'text-gray-600'
              }`}
          >
            Beranda
          </Link>
          <Link
            to="/course"
            className={`font-medium hover:text-blue-600 transition-colors ${isActiveLink('/')
                ? 'text-[#026078] font-semibold border-b-2 border-[#026078] pb-1'
                : 'text-gray-600'
              }`}
          >
            Kelas
          </Link>
          <Link
            to="/dashboard"
            className={`font-medium hover:text-blue-600 transition-colors ${isActiveLink('/dashboard')
                ? 'text-[#026078] font-semibold border-b-2 border-[#026078] pb-1'
                : 'text-gray-600'
              }`}
          >
            Dasbor
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Profile Icon */}
              <Link to="/profile" className="group text-gray-800 hover:text-[#0B7077]">
                <div className="bg-[#d2e6e4] text-[#0B7077] p-2 rounded group-hover:bg-[#014b60] group-hover:text-white transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </Link>
              {/* Logout Button */}
              <button
                onClick={openLogoutConfirmation}
                className="bg-[#0B7077] text-white px-7 py-3 rounded-md hover:bg-[#014b60] transition"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
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
              className={`block px-4 py-2 hover:bg-gray-100 ${isActiveLink('/')
                  ? 'text-[#026078] font-semibold bg-gray-50'
                  : 'text-gray-800'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/dashboard"
              className={`block px-4 py-2 hover:bg-gray-100 ${isActiveLink('/dashboard')
                  ? 'text-[#026078] font-semibold bg-gray-50'
                  : 'text-gray-600'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dasbor
            </Link>
            <div className="border-t border-gray-200 my-2"></div>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openLogoutConfirmation();
                }}
                className="block w-full text-left px-4 py-2 text-[#0B7077] font-medium hover:bg-gray-100"
              >
                Keluar
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </nav>

      {/* Popup Konfirmasi Logout */}
      <PopupModal
        isOpen={isPopupOpen}
        onClose={closeLogoutConfirmation}
        onConfirm={handleLogout}
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
      />
    </>
  );
};

export default Navbar;
