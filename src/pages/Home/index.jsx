import './style.css'
import MapSection  from '../../components/map/index'
import { FaWhatsapp,FaRegEnvelope, FaPhone, FaMapMarkedAlt} from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import img1 from "../../assets/cortina1.jpg"
import img2 from "../../assets/cortina2.jpg"
import img3 from "../../assets/cortina3.jpg"
import Footer from '../../components/footer'



function Home() {
   const images = [img1, img2, img3] 
   const navigate = useNavigate()

   const settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 4000,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      pauseOnHover: false  
   }

  return (
      <main class ="home">

            <section class = "hero">
               <Slider {...settings} class ="hero-slider">
                   {images.map((img, i) => (
                     <div key={i} class = "hero-slide">
                           <img src={img} alt= {`cortina-${i}`} />
                           <div class = "hero-overlay">
                              <h1>SILVANI PERSIANAS</h1>
                              <p>Fabricante de cortinas e persianas sobre medida</p>
                              <button onClick={() => navigate('/produtos')}>
                                 Conheça nossos produtos
                              </button>
                           </div>
                     </div>
                   ))}
               </Slider>
            </section>

            <section class = "sobre">
                <div class ="container-sobre">
                  <div class = "card-info">
                        <h2> Quem Somos</h2>
                        <p>
                           Somos especialistas em cortinas e persianas, unindo qualidade, elegância e funcionalidade para transformar seus ambientes.
                        </p>
                  </div>
                   <div class ="card-info">
                        <h2>O que entregamos</h2>
                        <p> Produtos personalizados, acabamentos impecáveis e atendimento próximo, garantindo a melhor experiência para nossos clientes.</p>
                   </div>
                </div>
            </section>
            
            <section class = "localizacao">
                  <h2>Nossa localização</h2>
                   <div class ="localizacao-container">
                        <div class ="map">
                           <MapSection/>
                        </div>


                        <div class = "info-local">
                           <h3>Venha nos visitar</h3>
                           <p>Estamos localizados em um região do Ataíde em Vila Velha, pronto para atender você!</p>
                        

                        <div class="endereco">
                           <FaMapMarkedAlt class = "icon"/>
                           <span> Rua José de Alencar, 143 - Cep 29119-157 - ES</span>
                        </div>

                        <div class ="horarios">
                           <h4>Horários de Atendimento</h4>
                           <ul>
                              <li>Seg - Qui: 08h às 18h</li>
                              <li>Sex: 08h às 17h</li>
                              <li>Sab e Dom: Fechado</li>
                           </ul>
                        </div>
                         <div class ="acoes">
                           <a href="https://www.google.com/maps?q=R.+José+de+Alencar,+89+-+Ataide"
                              target='_blank'
                              rel='noopener noreferrer'
                              class ="btn-maps"> 
                           Ver rota no Google Maps</a>
                        </div>
                     </div>
                   </div>
            </section>

            <section class = "orcamento">

               <div class ="orcamento-container">
                   <div class ="orcamento-txt">
                        <h2>Solicite seu orçamento</h2>
                        <p>
                           Preencha nosso formulário rápido e receba um orçamento personalizado.
                           Nossa equipe retornara com a melhor solução para o seu ambiente.
                        </p>
                        <button onClick={() => navigate("/arealojista")} class = "btn-orcamento">
                           Solicite aqui
                        </button>
                   </div>
               </div>
             
            </section>

           <Footer/>
      </main>
  )
}

export default Home
