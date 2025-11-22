import "./style.css";
import { FaRegEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";
import logo from "../../assets/logo-branca-SFp.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-premium">

        {/* LOGO + FRASE */}
        <div className="footer-brand">
          <img src={logo} alt="Logo Silvani Persianas" />
          <p>Produtos da melhor qualidade</p>
        </div>

        {/* CONTATOS */}
        <div className="footer-card">
          <h4>Contato</h4>

          <a href="mailto:silvanipersianas@hotmail.com">
            <FaRegEnvelope /> silvanipersianas@email.com
          </a>

          <a
            href="https://wa.me/5527999700341"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> +55 27 99970-0341
          </a>

          <span>
            <FaPhone /> (27) 3319-0520
          </span>
        </div>

        {/* PRODUTOS */}
        <div className="footer-card">
          <h4>Produtos</h4>
          <ul>
            <li>Cortinas</li>
            <li>Bandôs</li>
            <li>Persianas</li>
            <li>Sanefas</li>
          </ul>
        </div>

      </div>

      <div className="subfooter">
        © 2025 Silvani Persianas — Todos os direitos reservados
      </div>
    </footer>
  );
}

export default Footer;
