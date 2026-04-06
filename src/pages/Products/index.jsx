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
import { button, div } from 'framer-motion/client'


const produtos = [
  {
    imagem: db1,
    tipo: "rolo-double"
  },
  {
    imagem: db2,
    tipo: "rolo-double"
  },
  {
    imagem: db3,
    tipo: "rolo-double"
  },

  {
    imagem: pe1,
    tipo: "painel-europa"
  },
  {
    imagem: pe2,
    tipo: "painel-europa"
  },
  {
    imagem: pe3,
    tipo: "painel-europa"
  },
  {
    imagem: pe4,
    tipo: "painel-europa"
  },
  {
    imagem: pe5,
    tipo: "painel-europa"
  },
  
  {
    imagem: pr1,
    tipo: "painel-roma"
  },
  {
    imagem: pr2,
    tipo: "painel-roma"
  },

  {
    imagem: pvt1,
    tipo: "pvt"
  },

  {
    imagem: pvt1,
    tipo: "pvc"
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
    tipo: "romana"
  },

  {
    imagem: hor1,
    tipo: "hor-25"
  },
  
  {
    imagem: hor2,
    tipo: "pers-hor25"
  },
 
  {
    imagem: hor3,
    tipo: "pers-hor25"
  },
  {
    imagem: hor3,
    tipo: "pers-hor16"
  },
  {
    imagem: hor3,
    tipo: "pers-hor16"
  }

]

const estrutura = {
  "Todos": [],

  "Persiana Horizontal": ["hor-25", "hor-16"],
  "Cortina Rolô": ["Rolo", "rolo-double"],
  "Painel": ["painel-europa", "painel-roma"],
  "Persiana Vertical": ["pvc", "pvt"],
  "Cortina Romana": ["romana"]

}


const subcategoriasMap = {
  "Persiana Horizontal" : [
    { label: "25mm", tipo: "hor-25"},
    { label: "16mm", tipo: "hor-16"}
  ],

  "Cortina Rolô" : [
     {label: "Convencional", tipo: "Rolo"},
     {label: "Double Vision", tipo: "rolo-double"}
  ],

  "Painel": [
    {label: "Europa", tipo: "painel-europa"},
    {label: "Roma", tipo: "painel-roma"}
  ],

  "Persiana Vertical": [
    {label: "PVC", tipo: "pvc"},
    {label: "Tecido (PVT)", tipo: "pvt"}
  ],

  "Cortina Romana": []
}


function Products() {

 
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState("Todos")
  const [subcategoria, setSubcategoria] = useState(null)
 
  const produtosFiltrados = produtos.filter(p => {
    if (categoria === "Todos") return true

    if (subcategoria) {
      return p.tipo === subcategoria
    }

    return estrutura[categoria].includes(p.tipo)
  })

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

                          {Object.keys(estrutura).map(cat => (
                            <button
                              key = {cat}
                              className={`filter-btn ${categoria === cat ? "active" : ""}`}
                              onClick={() => {
                                setCategoria(cat)
                                setSubcategoria(null)
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                    </div>

                    {categoria !== "Todos" && subcategoriasMap[categoria]?.length > 0 && (
                        <div className='products-subfilters'>

                            {subcategoriasMap[categoria].map(sub => (
                                <button
                                  key = {sub.tipo}
                                  className={`filter-btn ${subcategoria === sub.tipo ? "active" : ""}`}
                                  onClick={() => setSubcategoria(sub.tipo)}
                                >
                                    {sub.label}
                                </button>
                            ))}

                        </div>
                    )}
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
