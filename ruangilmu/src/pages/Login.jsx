// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eyeIcon from '../components/eye_icon.svg';
import googleLogo from '../components/google_logo.svg';
import facebookLogo from '../components/facebook_logo.svg';
import kidImage from '../components/kid.png';
import '../index.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate();

  // Validasi form
  useEffect(() => {
    const isValid = email.trim() !== '' && password.length >= 6;
    setIsFormValid(isValid);
  }, [email, password]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulasi login (ganti dengan integrasi API nantinya)
    if (email === 'dummy@dummy.com' && password === 'dummyPw') {
      setShowSuccessToast(true);
      
      // Simpan status login ke sessionStorage
      sessionStorage.setItem('loginStatus', 'success');
      
      // Redirect setelah login berhasil
      setTimeout(() => {
        navigate('/home');
      }, 100);
    } else {
      setShowErrorToast(true);
      
      // Simpan status login error ke sessionStorage
      sessionStorage.setItem('loginStatus', 'error');
      
      // Tampilkan error selama 3 detik
      setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);
    }
  };

  // Cek login status dari sessionStorage saat komponen dimount
  useEffect(() => {
    const loginStatus = sessionStorage.getItem('loginStatus');
    
    if (loginStatus === 'success') {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      sessionStorage.removeItem('loginStatus');
    } else if (loginStatus === 'error') {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      sessionStorage.removeItem('loginStatus');
    }
  }, []);

  return (
    <div className="flex lg:flex-row w-full h-screen">
      <div className="flex flex-col h-max my-10 lg:mx-[100px] mx-5 lg:w-1/2 w-full lg:space-y-0 space-y-2 justify-center lg:items-start items-center tracking-widest">
        <div className="flex">
          <h1 className="font-[Overpass] font-extrabold text-[#444b59] lg:text-3xl text-xl">SELAMAT DATANG KEMBALI!</h1>
        </div>
        <div className="flex pb-5">
          <h2 className="font-[Nunito] lg:text-xl text-md text-[#444b59]">
            Belum punya akun? <Link to="/register" className="text-[#026078] font-bold hover:underline">Daftar</Link>
          </h2>
        </div>
        
        <div className="flex flex-col space-y-3 lg:space-y-6 w-5/6">
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-6">
            <div className="space-y-1 lg:space-y-2">
              <h3 className="font-[Nunito] text-[#444b59] lg:text-xl text-lg">Email</h3>
              <input
                type="email"
                placeholder="kamu@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-[#026078] rounded-md font-[Nunito] text-[#444b59] lg:text-lg text-md placeholder:text-[#026078] placeholder:opacity-50 w-full lg:py-2 py-1 lg:px-4 px-2"
              />
            </div>
            
            <div className="space-y-1 lg:space-y-2 relative">
              <h3 className="font-[Nunito] text-[#444b59] lg:text-xl text-lg">Kata Sandi</h3>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="6 karakter atau lebih"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-[#026078] rounded-md font-[Nunito] text-[#444b59] lg:text-lg text-md placeholder:text-[#026078] placeholder:opacity-50 w-full lg:py-2 py-1 lg:px-4 px-2 pr-10"
              />
              <img
                src={eyeIcon}
                alt="Toggle Password"
                onClick={togglePasswordVisibility}
                className={`absolute right-3 top-[47%] translate-y-[-50%] w-6 h-6 cursor-pointer ${showPassword ? 'opacity-40' : 'opacity-100'}`}
              />
              <p className={`text-sm text-red-600 font-[Nunito] ${password.length < 6 && password.length > 0 ? 'visible' : 'invisible'}`}>
                Kata sandi minimal 6 karakter.
              </p>
            </div>
            
            <div className="flex lg:flex-row">
              <input
                type="checkbox"
                id="remember"
                className="font-[Nunito] lg:text-lg text-sm text-[#444b59] checked:bg-[#026078] mr-2"
              />
              <p className="font-[Nunito] lg:text-lg text-sm text-[#444b59]">Ingat aku</p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`bg-[#026078] font-[Nunito] rounded-md lg:text-xl text-md text-white font-extrabold inset-shadow-sm inset-shadow-white py-3 px-4 w-full ${
                  isFormValid ? 'hover:bg-[#004b5f] active:bg-[#004455] cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                Login
              </button>
            </div>
          </form>
          
          <div className="grid grid-cols-3 items-center content-center gap-x-20 w-full">
            <div className="lg:pl-5 pl-2">
              <hr className="border-1 border-[#026078]" />
            </div>
            <div className="flex justify-center">
              <h4 className="font-[Nunito] text-[#444b59] lg:text-lg text-sm whitespace-nowrap">atau lanjutkan dengan</h4>
            </div>
            <div className="lg:pr-5 pr-2">
              <hr className="border-1 border-[#026078]" />
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center space-x-6 w-full">
            <button
              type="button"
              className="border border-[#026078] rounded-md cursor-pointer hover:bg-gray-500/20 lg:py-2 py-1 lg:px-6 px-3 h-full"
            >
              <img src={googleLogo} alt="Google" className="h-[48px]"/>
            </button>
            <button
              type="button"
              className="border border-[#026078] rounded-md cursor-pointer hover:bg-gray-500/20 lg:py-2 py-1 lg:px-6 px-3 h-full"
            >
              <img src={facebookLogo} alt="Facebook" className="h-[48px]"/>
            </button>
          </div>
        </div>
      </div>
      
      <div className="invisible lg:visible flex justify-end items-end bottom-0 right-0 fixed w-1/2">
        <div>
          <img src={kidImage} alt="Kid" className="w-full" />
        </div>
      </div>
      
      {/* Toast notifications */}
      {showSuccessToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white border-2 border-[#026078] text-green-500 py-2 px-4 rounded-md shadow-lg transition-all duration-300">
          Login berhasil!
        </div>
      )}
      
      {showErrorToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white border-2 border-[#026078] text-red-500 py-2 px-4 rounded-md shadow-lg transition-all duration-300">
          Email atau kata sandi salah!
        </div>
      )}
    </div>
  );
};

export default LoginPage;