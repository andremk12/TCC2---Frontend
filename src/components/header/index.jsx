import React from 'react';
import './style.css';
import logo from '../../assets/Logo-produ-removebg-preview.png'
import { useNavigate } from 'react-router-dom';

function Header() {

  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="logo" ><img src={logo} onClick={() => navigate("/")} /></div>
      <nav className="nav">
        <a href="/">Home</a>
        <a href="/cadastrar">Cadastrar</a>
        <a href="/produtos">Produtos</a>
        <a href="/arealojista">Área do Lojista</a>
      </nav>
    </header>
  );
}

export default Header;