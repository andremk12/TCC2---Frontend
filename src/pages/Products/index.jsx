import './style.css'
// import api from '../../services/api'
import Footer from '../../components/footer'

// Double Visions
import db1 from "../../assets/cotinas/Cortinas Double Vision/db1.jpg"
import db2 from "../../assets/cotinas/Cortinas Double Vision/db2.jpg"
import db3 from "../../assets/cotinas/Cortinas Double Vision/db3.jpg"

// Painel Europa
import pe1 from "../../assets/cotinas/Cortinas Painel Europa/pe1.jpg"
import pe2 from "../../assets/cotinas/Cortinas Painel Europa/pe2.jpg"
import pe3 from "../../assets/cotinas/Cortinas Painel Europa/pe3.jpeg"
import pe4 from "../../assets/cotinas/Cortinas Painel Europa/pe4.jpeg"
import pe5 from "../../assets/cotinas/Cortinas Painel Europa/pe5.jpeg"

// Painel Roma 
import pr1 from "../../assets/cotinas/Cortinas Painel Roma/pr1.jpeg"
import pr2 from "../../assets/cotinas/Cortinas Painel Roma/pr2.jpeg"

// PVT
import pvt1 from "../../assets/cotinas/Cortinas PVT/pvt1.jpg"

// Rolo
import rolo1 from "../../assets/cotinas/Cortinas Rolô/rolo1.jpg"
import rolo2 from "../../assets/cotinas/Cortinas Rolô/rolo2.jpg"
import rolo3 from "../../assets/cotinas/Cortinas Rolô/rolo3.jpg"
import rolo4 from "../../assets/cotinas/Cortinas Rolô/rolo4.jpg"
import rolo5 from "../../assets/cotinas/Cortinas Rolô/rolo5.jpg"
import rolo6 from "../../assets/cotinas/Cortinas Rolô/rolo6.jpg"
import rolo7 from "../../assets/cotinas/Cortinas Rolô/rolo7.jpg"
import rolo8 from "../../assets/cotinas/Cortinas Rolô/rolo8.jpg"
import rolo9 from "../../assets/cotinas/Cortinas Rolô/rolo9.jpg"
import rolo10 from "../../assets/cotinas/Cortinas Rolô/rolo10.jpeg"
import rolo11 from "../../assets/cotinas/Cortinas Rolô/rolo11.jpeg"
import rolo12 from "../../assets/cotinas/Cortinas Rolô/rolo12.jpeg"

// Romanas
import romana from "../../assets/cotinas/Cortinas Romana/romana.jpg"

// Horizontais 25m
import hor1 from "../../assets/cotinas/Persianas Horizontais 25mm/hor1.jpg"
import hor2 from "../../assets/cotinas/Persianas Horizontais 25mm/hor2.jpg"
import hor3 from "../../assets/cotinas/Persianas Horizontais 25mm/hor3.jpg"

import { useState } from "react"
import { useNavigate } from 'react-router-dom';

const produtos = [
  {
    imagem: db1,
    tipo: "Double-Vision"
  },
  {
    imagem: db2,
    tipo: "Double-Vision"
  },
  {
    imagem: db3,
    tipo: "Double-Vision"
  },

  {
    imagem: pe1,
    tipo: "Painel-Europa"
  },
  {
    imagem: pe2,
    tipo: "Painel-Europa"
  },
  {
    imagem: pe3,
    tipo: "Painel-Europa"
  },
  {
    imagem: pe4,
    tipo: "Painel-Europa"
  },
  {
    imagem: pe5,
    tipo: "Painel-Europa"
  },
  
  {
    imagem: pr1,
    tipo: "Painel-Roma"
  },
  {
    imagem: pr2,
    tipo: "Painel-Roma"
  },

  {
    imagem: pvt1,
    tipo: "Pvt"
  },


  {
    imagem: rolo1,
    tipo: "Rolo"
  },

  {
    imagem: rolo2,
    tipo: "Rolo"
  },

  {
    imagem: rolo3,
    tipo: "Rolo"
  },

  {
    imagem: rolo4,
    tipo: "Rolo"
  },

  {
    imagem: rolo5,
    tipo: "Rolo"
  },

  {
    imagem: rolo6,
    tipo: "Rolo"
  },

  {
    imagem: rolo7,
    tipo: "Rolo"
  },

  {
    imagem: rolo8,
    tipo: "Rolo"
  },

  {
    imagem: rolo9,
    tipo: "Rolo"
  },

  {
    imagem: rolo10,
    tipo: "Rolo"
  },

  {
    imagem: rolo11,
    tipo: "Rolo"
  },

  {
    imagem: rolo12,
    tipo: "Rolo"
  },
  
  {
    imagem: romana,
    tipo: "Romana"
  },

  {
    imagem: hor1,
    tipo: "pers-hor25"
  },
  
  {
    imagem: hor2,
    tipo: "pers-hor25"
  },
 
  {
    imagem: hor3,
    tipo: "pers-hor25"
  }

]

function Products() {

 
  const [filtro, setFiltro] = useState("Todos")
  const navigate = useNavigate()

  const filtrosMap = {
    Todos: () => true,
    Persianas: p => p.tipo === "pers-hor25",
    Cortinas: p => ["Double-Vision", "Painel-Europa", "Painel-Roma", "Pvt", "Romana"].includes(p.tipo),
    Blackout: p => p.tipo === "Pvt",
    Rolô: p => p.tipo === "Rolo"
  }

  const produtosFiltrados = produtos.filter(filtrosMap[filtro])

  return (
      <>
        <div className="productus-container">
              <section className="products-header">
                      <h1>Transforme seus ambientes com elegância</h1>
                      <p>Persianas e cortinas sob medida para cada espaço</p>

                    <div className = "products-actions">
                      <button 
                        className='btn-primary'
                        onClick={() => navigate("/arealojista")}
                      > 
                        Solicitar orçamento 
                      </button>

                      <button 
                        className='btn-secondary'
                        onClick={() => window.open("https://wa.me/5527999700341", "_blank")}
                        > 
                        Falar no WhatsApp 
                      </button>
                    </div>

                    <div className='products-filters'>
                         <button  
                            className={`filter-btn ${filtro === "Todos" ? "active" : ""}`}
                            onClick = {() => setFiltro("Todos")}  
                          >
                            Todos
                          </button>

                         <button 
                            className={`filter-btn ${filtro === "Persianas" ? "active" : ""}`}
                            onClick={() => setFiltro("Persianas")}
                          >
                            Persianas
                          </button>

                         <button 
                            className={`filter-btn ${filtro === "Cortinas" ? "active" : ""}`}
                            onClick={() => setFiltro("Cortinas")}
                          >
                            Cortinas
                          </button>

                         <button 
                           className={`filter-btn ${filtro === "Blackout" ? "active" : ""}`}
                           onClick={() => setFiltro("Blackout")}
                          >
                            PVT
                          </button>

                         <button 
                            className={`filter-btn ${filtro === "Rolô" ? "active" : ""}`}
                            onClick={() => setFiltro("Rolô")}
                          >
                            Rolô
                          </button>
                    </div>
              </section>

              <section className='masonry-grid'>
                  {produtosFiltrados.map((produto, index) => (
                    <div key={index} className="masonry-item">
                        <img src={produto.imagem} alt={produto.nome}/>
                        <div className="img-overlay"/> 
                    </div>
                  ))}
              </section>
        </div>

        <Footer />
      </>
  )
}

export default Products
