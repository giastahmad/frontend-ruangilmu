import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 
import Toast from '../components/jsx/Toast';

const Verify = () => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Cek status register dari sessionStorage saat komponen dimount
    const status = sessionStorage.getItem('registerStatus');
    if (status === 'success') {
      setShowToast(true);
      sessionStorage.removeItem('registerStatus');
    }
  }, []);

  const handleResendEmail = () => {
    // Implementasi fungsi untuk mengirim ulang email
    // Ini akan bergantung pada bagaimana backend Anda bekerja
    console.log("Resending email verification...");
    // Di sini Anda bisa menambahkan API call untuk mengirim ulang email
    
    // Tampilkan toast untuk konfirmasi kepada pengguna
    setShowToast(true);
  };

  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:w-full w-5/6">
        <div className="grid grid-row-3 lg:gap-y-12 gap-y-6 justify-center">
          <div className="flex flex-col items-center">
            <h1 className="font-[Overpass] font-extrabold text-[#444b59] lg:text-3xl text-xl lg:mb-6 mb-3">
              Verify your email address
            </h1>
            <p className="font-[Nunito] lg:text-xl text-md text-[#444b59] text-center">
              Please click on the link that has just been sent to your email address to verify your email and continue the registration process.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="font-[Nunito] lg:text-xl text-md text-[#444b59] lg:mb-3 mb-1">
              Still can't find the email?
            </p>
            <button
              className="bg-[#026078] font-[Nunito] rounded-md lg:text-lg text-sm text-white font-bold cursor-pointer hover:bg-[#004b5f] active:bg-[#004455] py-3 px-4"
              onClick={handleResendEmail}
            >
              Resend Email
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="font-[Nunito] lg:text-xl text-md text-[#444b59]">
              Need help?{" "}
              <Link to="/contact" className="text-[#026078] font-bold hover:underline">
                Contact Us
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toast 
        message="Register Successful! Please check your email." 
        type="success" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
};

export default Verify;