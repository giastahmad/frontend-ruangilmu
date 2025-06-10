import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import Toast from '../components/jsx/Toast';

const Verify = () => {
  const [toastConfig, setToastConfig] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Cek status register dari sessionStorage saat komponen dimount
    const status = sessionStorage.getItem('registerStatus');
    if (status === 'success') {
      showToast('Pendaftaran berhasil, tolong periksa email kamu.', 'success');
      sessionStorage.removeItem('registerStatus');
    }

    // Ambil email dari sessionStorage yang disimpan saat register
    const email = sessionStorage.getItem('registerEmail');
    if (email) {
      setUserEmail(email);
    }

    // Fallback: coba ambil dari localStorage jika ada
    if (!email) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserEmail(userData.email || '');
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  // Fungsi untuk menampilkan toast
  const showToast = (message, type = 'success') => {
    setToastConfig({
      message,
      type,
      isVisible: true
    });
  };

  // Handle toast close
  const handleToastClose = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false
    });
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      showToast('Email pengguna tidak ditemukan. Silakan daftar ulang.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://ruangilmu.up.railway.app/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message || 'Email verifikasi berhasil dikirim ulang!', 'success');
      } else {
        showToast(data.message || 'Gagal mengirim ulang email verifikasi', 'error');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      showToast('Terjadi kesalahan pada server!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:w-full w-5/6">
        <div className="grid grid-row-3 lg:gap-y-12 gap-y-6 justify-center">
          <div className="flex flex-col items-center">
            <h1 className="font-[Overpass] font-extrabold text-[#444b59] lg:text-3xl text-xl lg:mb-6 mb-3">
              Verifikasi Alamat Email Kamu
            </h1>
            <p className="font-[Nunito] lg:text-xl text-md text-[#444b59] text-center">
              Silakan klik tombol yang baru saja dikirim ke alamat email Kamu untuk memverifikasi email Kamu dan melanjutkan proses pendaftaran.
            </p>
            {userEmail && (
              <p className="font-[Nunito] lg:text-lg text-sm text-[#026078] text-center mt-2">
                Email dikirim ke: <strong>{userEmail}</strong>
              </p>
            )}
          </div>

          <div className="flex flex-col items-center">
            <p className="font-[Nunito] lg:text-xl text-md text-[#444b59] lg:mb-3 mb-1">
              Masih belum menemukan emailnya?
            </p>
            <button
              className={`bg-[#026078] font-[Nunito] rounded-md lg:text-lg text-sm text-white font-bold py-3 px-4 ${isLoading || !userEmail
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:bg-[#004b5f] active:bg-[#004455]'
                }`}
              onClick={handleResendEmail}
              disabled={isLoading || !userEmail}
            >
              {isLoading ? 'Mengirim...' : 'Kirim Ulang email verifikasi'}
            </button>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-[Nunito] lg:text-xl text-md text-[#444b59]">
              menuju halaman{" "}
              <Link to="/login" className="text-[#026078] font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={handleToastClose}
        duration={3000}
      />
    </>
  );
};

export default Verify;