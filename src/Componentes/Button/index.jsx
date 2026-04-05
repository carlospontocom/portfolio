import React from 'react';

const Button = ({ text, onClick, type = 'button' }) => {
  const buttonClasses = `
    px-8 py-3
    bg-gradient-to-r from-blue-600 to-purple-600
    text-white
    font-bold
    rounded-lg
    shadow-lg
    hover:shadow-xl
    hover:scale-105
    transform transition-all duration-300
    focus:outline-none
    focus:ring-4 focus:ring-purple-300
    w-full
    block
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
