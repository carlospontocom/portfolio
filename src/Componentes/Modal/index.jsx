import React from 'react';

// Ícone de Fechar (X)
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Overlay
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-2xl relative max-w-2xl w-full transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()} // Evita que o modal feche ao clicar dentro dele
      >
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 z-10"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <CloseIcon />
        </button>
        
        <div className="overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
