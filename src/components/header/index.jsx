import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import logo from '../../assets/Logo-produ-removebg-preview.png';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">
        <img
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/cadastrar">Cadastrar</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/arealojista">Área do Lojista</Link>
      </nav>
    </header>
  );
}

export default Header;
