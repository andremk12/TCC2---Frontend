import './style.css'
// import api from '../../services/api'
import Footer from '../../components/footer'


const produtos = [
  {
    nome: "Persiana Rolô Blackout",
    imagem: "https://images.pexels.com/photos/3965520/pexels-photo-3965520.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina Wave Linho",
    imagem: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Persiana Romana Duo",
    imagem: "https://images.pexels.com/photos/3965552/pexels-photo-3965552.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina Painel Translúcida",
    imagem: "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Persiana de Alumínio 25mm",
    imagem: "https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina de Tecido Blackout",
    imagem: "https://images.pexels.com/photos/6585764/pexels-photo-6585764.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Persiana Vertical Tecido",
    imagem: "https://images.pexels.com/photos/6585768/pexels-photo-6585768.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina Rolô Tela Solar",
    imagem: "https://images.pexels.com/photos/6585765/pexels-photo-6585765.jpeg?auto=compress&cs=tinysrgb&w=800",
  },

  {
    nome: "Cortina Luxo Bege",
    imagem: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Cortina Quarto Aconchegante",
    imagem: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Persiana Sala Ampla",
    imagem: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Cortina Elegante Cinza",
    imagem: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
  },
]

function Products() {
 


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


  return (
      <>
        <div className="productus-container">
              <section className="products-header">
                      <h1>Transforme seus ambientes com elegância</h1>
                      <p>Persianas e cortinas sob medida para cada espaço</p>

                    <div className = "products-actions">
                      <button className='btn-primary'> Solicitar orçamento </button>
                      <button className='btn-secondary'> Falar no WhatsApp </button>
                    </div>

                    <div className='products-filters'>
                         <button className="filter-btn active">Todos</button>
                         <button className="filter-btn">Persianas</button>
                         <button className="filter-btn">Cortinas</button>
                         <button className="filter-btn">Blackout</button>
                         <button className="filter-btn">Rolô</button>
                    </div>
              </section>

              <section className='masonry-grid'>
                  {produtos.map((produto, index) => (
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
