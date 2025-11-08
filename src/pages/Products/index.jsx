import './style.css'
import { useState, useEffect } from 'react'
// import api from '../../services/api'
import ProductGrid from '../../components/productsGrid'
import Footer from '../../components/footer'
import { GalleryHorizontal } from 'lucide-react'



const mockProdutos = [
  {
    id: 1,
    nome: "Cortina Blackout Premium",
    cor: "Cinza Chumbo",
    material: "Poliéster 100%",
    valor: 249.90,
    tamanho: "2,00m x 1,80m",
    quantidade: 12,
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    nome: "Cortina de Linho Natural",
    cor: "Bege Areia",
    material: "Linho e Algodão",
    valor: 329.00,
    tamanho: "2,50m x 2,00m",
    quantidade: 8,
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    nome: "Cortina Translúcida Luxo",
    cor: "Branca",
    material: "Voil Importado",
    valor: 199.90,
    tamanho: "2,20m x 1,50m",
    quantidade: 20,
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    nome: "Cortina Térmica Eclipse",
    cor: "Azul Marinho",
    material: "Blackout Termoacústico",
    valor: 289.90,
    tamanho: "2,80m x 2,00m",
    quantidade: 5,
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    nome: "Cortina de Veludo Clássica",
    cor: "Verde Musgo",
    material: "Veludo Premium",
    valor: 399.00,
    tamanho: "2,60m x 2,20m",
    quantidade: 4,
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    nome: "Cortina Estampada Floral",
    cor: "Rosa Claro",
    material: "Algodão Misto",
    valor: 179.90,
    tamanho: "2,00m x 1,50m",
    quantidade: 15,
    imagem:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  }
]

function Products() {
  const [produtos, setProdutos] = useState([])

  // useEffect(() => {
  //   async function getProducts() {
  //     try {
  //       const response = await api.get('/produtos')


  //       const mappedData = response.data.map(item => ({
  //         image: item.imagem || 'https://via.placeholder.com/300x200',
  //         title: item.nome,
  //         color: item.cor,
  //         material: item.material,
  //         price: item.valor ? `R$ ${Number(item.valor).toFixed(2)}` : '—',
  //         size: item.tamanho,
  //         quantity: item.quantidade
  //       }))

  //       setProdutos(mappedData)
  //     } catch (error) {
  //       console.error("Erro ao buscar produtos:", error)
  //     }
  //   }

  //   getProducts()
  // }, [])

   useEffect(() => {
    // Simula tempo de carregamento da API
    const timer = setTimeout(() => {
      setProdutos(mockProdutos)
    }, 800)

    return () => clearTimeout(timer)
  }, [])


  return (
    <>
      <div class = "products-page">
         <div class = "products-card">
              <div class = "products-header">
                  <div class = "products-header-left">
                     <GalleryHorizontal class = "products-icon"/>
                     <h2>Conheça nossos produtos</h2>
                  </div>
              </div>

              <p class = "products-subtitle">
                Cortinas que unem estilom conforto e funcionalidade
              </p>

              <div class = "products-container">
                  <ProductGrid items ={produtos} showPrice ={false}/>
              </div>
          </div> 
       </div>

      <Footer/>
    </>
  )
}

export default Products
