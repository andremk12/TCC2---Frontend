import "./style.css";
import { FaRegEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";
import logo from "../../assets/logo-branca-SFp.png"


function Footer() {
  return (
    <div class ="footer">
      <div className="footer-flex">
        <div>
         
        </div>
        
        <div className="footer-sobre">
         <img src={logo} alt="logo" />
          <p>Produtos da melhor qualidade</p>
        </div>

        <div className="footer-contatos">
          <h4>Contato</h4>
          <ul>
            <li>
              <FaRegEnvelope className="icon-f" />
              <a href="mailto:silvanipersianas@email.com">
                silvanipersianas@email.com
              </a>
            </li>
            <li>
              <FaWhatsapp className="icon-f" />
              <a
                href="https://wa.me/5527999700341"
                target="_blank"
                rel="noopener noreferrer"
              >
                Whatsapp: +55 27 99970-0341
              </a>
            </li>
            <li>
              <FaPhone className="icon-f" />
              <span>(27) XXXX-XXXX</span>
            </li>
          </ul>
        </div>

        <div className="footer-produtos">
          <h4>Produtos</h4>
          <ul>
            <li>Cortinas</li>
            <li>Bandos</li>
            <li>Persianas</li>
            <li>Sanefas</li>
          </ul>
        </div>
      </div>

      <div className="subfooter">© 2025 Silvani Persianas</div>
    </div>
  )
}

export default Footer;
