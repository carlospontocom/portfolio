import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white py-2 shadow-sm fixed w-full z-20">
      <div className="max-w-[1440px] mx-auto px-12">
        <ul className="flex gap-5 text-[22px]">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/cadastro">Cadastro</Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header;
