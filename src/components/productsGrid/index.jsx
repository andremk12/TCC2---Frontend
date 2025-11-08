import { PawPrint, Slice, SpaceIcon } from "lucide-react";
import "./style.css";
import { useState } from "react"

const ProductGrid = ({ items = []}) => {
   const [selected, setSelected] = useState(null)

   if (!items || items.length === 0) {
    return (
      <p style = {{textAlign: "center", color: "#666", marginTop: 24}}>
         Carregando produtos...
      </p>
    )
   }

   const openModal = (item) => setSelected(item)
   const closeModal = () => setSelected(null)
  
    return (
          <>
            <div class = "prd-grid">
               {items.map((i) => (
                  <button 
                    key = {i.id ?? i.nome}
                    class = "prd-card"
                    onClick={() => openModal(i)}
                    aria-label={`Abrir detalhes de ${i?.nome || "produto"}`}
                  >
                    <div class = "prd-imageWrap">
                        <img 
                          src= {i.imagem}
                          alt= {i.nome}
                          loading= "lazy"
                          class = "prd-image"
                          />
                    </div>


                    <div class = "prd-info">
                        <h3 class = "prd-title" title={i.nome}>
                            {i.nome}
                        </h3>

                        <div class = "prd-meta">
                              {i.cor && <span class = "prd-badge">{i.cor}</span>}
                              {i.material && <span class = "prd-badge">{i.material}</span>}
                              {i.tamanho && <span class = "prd-badge">{i.tamanho}</span>}
                        </div>

                        <div class = "prd-footer">
                            <span class = "prd-qtd">
                                  {typeof i.quantidade === "number" ? `Estoque: ${i.quantidade}` : "Sob consulta"}
                            </span>
                        </div>
                    </div>
                  </button>
               ))}
            </div>

             { selected && (
               <div class = "prd-modalOverlay" onClick={closeModal}>
                  <div class = "prd-modal" onClick={(e) => e.stopPropagation()}>
                        <button class = "prd-closeBtn" onClick={closeModal} aria-label="fechar">x</button>

                        <img src={selected.imagem} alt={selected.nome} class ="prd-modalImage"/>

                        <div class = "prd-modalInfo">
                            <h2>{selected.nome}</h2>
                            {selected.cor && (
                              <p><strong>Cor:</strong></p>
                            )}
                            {selected.material && (
                              <p><strong>Material:</strong> {selected.material}</p>
                            )}
                            {selected.tamanho && (
                              <p><strong>Tamanho:</strong> {selected.tamanho}</p>
                            )}
                            {typeof selected.quantidade === "number" && (
                              <p><strong>Estoque:</strong> {selected.quantidade} unidade(s)</p>
                            )}
                        </div>
                  </div>

               </div>
             )}
          </>
    )
};

export default ProductGrid;
