// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/jsx/Toast';
import eyeIcon from '../components/img/eye_icon.svg';
import googleLogo from '../components/img/google_logo.svg';
import facebookLogo from '../components/img/facebook_logo.svg';
import kidImage from '../components/img/kid.png';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // State untuk Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

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
      // Tampilkan toast sukses
      setToastMessage('Login berhasil!');
      setToastType('success');
      setShowToast(true);

      // Simpan status login ke sessionStorage
      sessionStorage.setItem('loginStatus', 'success');

      // Redirect setelah login berhasil
      setTimeout(() => {
        navigate('/home');
      }, 100);
    } else {
      // Tampilkan toast error
      setToastMessage('Email atau kata sandi salah!');
      setToastType('error');
      setShowToast(true);

      // Simpan status login error ke sessionStorage
      sessionStorage.setItem('loginStatus', 'error');
    }
  };

  // Cek login status dari sessionStorage saat komponen dimount
  useEffect(() => {
    const loginStatus = sessionStorage.getItem('loginStatus');

    if (loginStatus === 'success') {
      setToastMessage('Login berhasil!');
      setToastType('success');
      setShowToast(true);
      sessionStorage.removeItem('loginStatus');
    } else if (loginStatus === 'error') {
      setToastMessage('Email atau kata sandi salah!');
      setToastType('error');
      setShowToast(true);
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

            <div className="grid grid-cols-2 lg:flex-row">
              <div className='flex flex-row'>
                <input
                  type="checkbox"
                  id="remember"
                  className="font-[Nunito] lg:text-lg text-sm text-[#444b59] checked:bg-[#026078] mr-2"
                />
                <label for="remember" className="flex font-[Nunito] lg:text-lg text-sm text-[#444b59] justify-center items-center">Ingat aku</label>
              </div>
              <div>
                <Link href="/Lupa_Password" className='flex justify-end items-center lg:text-lg text-sm text-[#026078] hover:underline'>Lupa password?</Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`bg-[#026078] font-[Nunito] rounded-md lg:text-xl text-md text-white font-extrabold inset-shadow-sm inset-shadow-white py-3 px-4 w-full ${isFormValid ? 'hover:bg-[#004b5f] active:bg-[#004455] cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
              >
                Masuk
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
              <img src={googleLogo} alt="Google" className="h-[48px]" />
            </button>
            <button
              type="button"
              className="border border-[#026078] rounded-md cursor-pointer hover:bg-gray-500/20 lg:py-2 py-1 lg:px-6 px-3 h-full"
            >
              <img src={facebookLogo} alt="Facebook" className="h-[48px]" />
            </button>
          </div>
        </div>
      </div>

      <div className="invisible lg:visible flex justify-end items-end bottom-0 right-0 fixed w-1/2">
        <div>
          <img src={kidImage} alt="Kid" className="w-full" />
        </div>
      </div>

      {/* Menggunakan komponen Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Login;