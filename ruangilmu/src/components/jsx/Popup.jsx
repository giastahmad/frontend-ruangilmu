import React, { useState, useEffect } from 'react';

const PopupModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message = "Apakah Anda yakin?",
  confirmText = "Ya",
  cancelText = "Batal"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform ${isOpen ? 'scale-100' : 'scale-95'} transition-transform duration-200`}>
        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-700 text-lg">{message}</p>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-white text-[#026078] rounded border border-[#026078] hover:bg-gray-200 hover:text-[#004b5f] active:bg-gray-100"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-[#026078] text-white rounded hover:bg-[#004b5f] active:bg-[#004455]"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;