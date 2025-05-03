import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, isVisible, onClose }) => {
  const [show, setShow] = useState(isVisible);
  
  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  // Menentukan warna berdasarkan tipe
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'border-[#026078] text-green-500';
      case 'error':
        return 'border-[#026078] text-red-500';
      case 'warning':
        return 'border-[#026078] text-yellow-600';
      case 'info':
        return 'border-[#026078] text-blue-600';
      default:
        return 'border-[#026078] text-green-500';
    }
  };
  
  if (!show) return null;
  
  return (
    <div 
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-white border-2 ${getToastStyles()} py-2 px-4 rounded-md shadow-lg transition-all duration-300`}
    >
      {message}
    </div>
  );
};

export default Toast;