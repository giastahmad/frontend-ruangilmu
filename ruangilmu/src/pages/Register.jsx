// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/jsx/Toast'; // Mengimpor komponen Toast
import eyeIcon from '../components/img/eye_icon.svg';
import googleLogo from '../components/img/google_logo.svg';
import facebookLogo from '../components/img/facebook_logo.svg';
import kidImage from '../components/img/kid.png';
import '../index.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDo2N8rNOYXgXJDTahHCKwosF0AsCDxLwM",
  authDomain: "ppl-ruang-ilmu.firebaseapp.com",
  projectId: "ppl-ruang-ilmu",
  storageBucket: "ppl-ruang-ilmu.firebasestorage.app",
  messagingSenderId: "488500636968",
  appId: "1:488500636968:web:75618c5406a6e10f75341d",
  measurementId: "G-9HQY9B3PDG"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  // State untuk Toast
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const navigate = useNavigate();

  // Validasi form
  useEffect(() => {
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    const isConfirmValid = confirmPassword === password && confirmPassword !== '';
    const areFieldsFilled = fullName.trim() !== '' && email.trim() !== '' && password !== '' && confirmPassword !== '';

    setIsFormValid(isPasswordValid && isConfirmValid && areFieldsFilled);
  }, [fullName, email, password, confirmPassword]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle toast close
  const handleToastClose = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false
    });
  };

  // Menampilkan toast
  const showToast = (message, type = 'success') => {
    setToastConfig({
      message,
      type,
      isVisible: true
    });
  };

  // Handle Google Sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);

      const idToken = await result.user.getIdToken();
      const email = result.user.email;
      const displayName = result.user.displayName;

      const response = await fetch('https://backend-ruangilmu-production.up.railway.app/auth/oauth-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          email,
          displayName
        }),
      });

      const data = await response.json();


      if (response.ok) {
        localStorage.setItem('accessToken', data.data.auth.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast(data.message || 'Google login berhasil!', 'success');

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        showToast(data.message || 'Google login gagal pada server', 'error');
      }
    } catch (error) {
      console.error('Google Sign-In error : ', error);
      showToast('Google Login gagal : ', + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://backend-ruangilmu-production.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: fullName,
          email: email,
          password: password,
          confirmPassword: confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || 'Registrasi gagal', 'error');
        sessionStorage.setItem('registerStatus', 'error');
      } else {
        showToast('Register berhasil Silahkan periksa email kamu', 'success');
        sessionStorage.setItem('registerStatus', 'success');
        sessionStorage.setItem('registerEmail', email);

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setTimeout(() => {
          navigate('/verify');
        }, 1500);
      }
    } catch (error) {
      console.error('Registrasi Gagal: ', error);
      showToast('Terjadi Kesalahan pada server!', 'error');
      sessionStorage.setItem('registerStatus', 'error');
    } finally {
      setIsLoading(false)
    }
  };

  // Cek register status dari sessionStorage saat komponen dimount
  useEffect(() => {
    const registerStatus = sessionStorage.getItem('registerStatus');

    if (registerStatus === 'success') {
      showToast('Register berhasil! Silahkan periksa email anda.', 'success');
      sessionStorage.removeItem('registerStatus');
    } else if (registerStatus === 'error') {
      showToast('Email telah digunakan!', 'error');
      sessionStorage.removeItem('registerStatus');
    }
  }, []);

  return (
    <div className="flex lg:flex-row h-screen">
      <div className="flex flex-col h-max my-10 lg:mx-[100px] mx-5 lg:w-1/2 w-full lg:space-y-0 space-y-2 justify-center lg:items-start items-center tracking-widest">
        <div className="flex">
          <h1 className="font-[Overpass] font-extrabold text-[#444b59] lg:text-3xl text-xl">SELAMAT DATANG!</h1>
        </div>
        <div className="flex pb-3">
          <h2 className="font-[Nunito] lg:text-xl text-md text-[#444b59]">
            Sudah punya akun? <Link to="/login" className="text-[#026078] font-bold hover:underline">Masuk</Link>
          </h2>
        </div>

        <div className="flex flex-col space-y-2 lg:space-y-4 w-5/6">
          <div className="form">
            <form onSubmit={handleSubmit} className="">
              <div className="mb-5">
                <h3 className="font-[Nunito] text-[#444b59] lg:text-xl text-lg">Nama Lengkap</h3>
                <input
                  type="text"
                  placeholder="Nama lengkap kamu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-2 border-[#026078] rounded-md font-[Nunito] text-[#444b59] lg:text-lg text-md placeholder:text-[#026078] placeholder:opacity-50 w-full lg:py-[5px] py-1 lg:px-4 px-2"
                />
              </div>

              <div className="mb-5">
                <h3 className="font-[Nunito] text-[#444b59] lg:text-xl text-lg">Email</h3>
                <input
                  type="email"
                  placeholder="kamu@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-[#026078] rounded-md font-[Nunito] text-[#444b59] lg:text-lg text-md placeholder:text-[#026078] placeholder:opacity-50 w-full lg:py-[5px] py-1 lg:px-4 px-2"
                />
              </div>

              <div className="relative">
                <h3 className="font-[Nunito] text-[#444b59] lg:text-xl text-lg">Kata Sandi</h3>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter (huruf besar, kecil, angka)."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-[#026078] rounded-md font-[Nunito] text-[#444b59] lg:text-lg text-md placeholder:text-[#026078] placeholder:opacity-50 w-full lg:py-[5px] py-1 lg:px-4 px-2 pr-10"
                />
                <img
                  src={eyeIcon}
                  alt="Toggle Password"
                  onClick={togglePasswordVisibility}
                  className={`absolute right-3 top-[55%] translate-y-[-50%] w-6 h-6 cursor-pointer ${showPassword ? 'opacity-40' : 'opacity-100'}`}
                />
                <p className={`text-sm text-red-600 font-[Nunito] ${password.length > 0 && password.length < 6 ? 'visible' : 'invisible'}`}>
                  Kata sandi harus terdiri dari minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.
                </p>
              </div>

              <div className="relative">
                <h3 className="font-[Nunito] text-[#444b59] lg:text-xl text-lg">Ketik Ulang Kata Sandi</h3>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Min. 8 karakter (huruf besar, kecil, angka)."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-2 border-[#026078] rounded-md font-[Nunito] text-[#444b59] lg:text-lg text-md placeholder:text-[#026078] placeholder:opacity-50 w-full lg:py-[5px] py-1 lg:px-4 px-2 pr-10"
                />
                <img
                  src={eyeIcon}
                  alt="Toggle Confirm Password"
                  onClick={toggleConfirmPasswordVisibility}
                  className={`absolute right-3 top-[55%] translate-y-[-50%] w-6 h-6 cursor-pointer ${showConfirmPassword ? 'opacity-40' : 'opacity-100'}`}
                />
                <p className={`text-sm text-red-600 font-[Nunito] ${confirmPassword.length > 0 && confirmPassword !== password ? 'visible' : 'invisible'}`}>
                  Kata sandi tidak sesuai.
                </p>
              </div>

              <div className="flex lg:flex-row my-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="font-[Nunito] lg:text-lg text-sm text-[#444b59] checked:bg-[#026078] mr-2"
                />
                <label htmlFor="remember" className="font-[Nunito] lg:text-lg text-sm text-[#444b59]">Ingat aku</label>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`bg-[#026078] font-[Nunito] rounded-md lg:text-xl text-md text-white font-extrabold inset-shadow-sm inset-shadow-white py-3 px-4 w-full ${isFormValid ? 'hover:bg-[#004b5f] active:bg-[#004455] cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? 'Memproses...' : 'Daftar'}
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-3 items-center content-center gap-x-20 w-full my-4">
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

          <div className="flex flex-row items-start justify-center space-x-6 w-full h-full">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="border border-[#026078] rounded-md cursor-pointer hover:bg-gray-500/20 lg:py-2 py-1 lg:px-6 px-3 h-max"
            >
              <img src={googleLogo} alt="Google" className="h-[48px]" />
            </button>
            <button
              type="button"
              className="border border-[#026078] rounded-md cursor-pointer hover:bg-gray-500/20 lg:py-2 py-1 lg:px-6 px-3 h-max"
              disabled={isLoading}
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

      {/* Komponen Toast */}
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={handleToastClose}
        duration={3000}
      />
    </div>
  );
};

export default RegisterPage;