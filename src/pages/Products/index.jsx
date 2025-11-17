import './style.css'
// import api from '../../services/api'
import Footer from '../../components/footer'

const produtos = [
   {
    nome: "Persiana Rolô Blackout",
    isRecomendado: true,
    imagem:
      "https://images.pexels.com/photos/3965520/pexels-photo-3965520.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
   {
    nome: "Cortina Wave Linho",
    isRecomendado: false,
    imagem:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80",
  },
  {
    nome: "Persiana Romana Duo",
    isRecomendado: true,
    imagem:
      "https://images.pexels.com/photos/3965552/pexels-photo-3965552.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina Painel Translúcida",
    isRecomendado: false,
    imagem:
      "https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Persiana de Alumínio 25mm",
    isRecomendado: false,
    imagem:
      "https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina de Tecido Blackout",
    isRecomendado: true,
    imagem:
      "https://images.pexels.com/photos/6585764/pexels-photo-6585764.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Persiana Vertical Tecido",
    isRecomendado: false,
    imagem:
      "https://images.pexels.com/photos/6585768/pexels-photo-6585768.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    nome: "Cortina Rolô Tela Solar",
    isRecomendado: true,
    imagem:
      "https://images.pexels.com/photos/6585765/pexels-photo-6585765.jpeg?auto=compress&cs=tinysrgb&w=800",
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
        <div className="products-ctn">
            <section className = "products-hero">
                <h1 className = "products-title">Catálogo de Produtos</h1>
                <p className="products-stitle">
                      Confira algumas opções selecionadas do nosso portfólio. Produtos em destaque recebem nossa recomendação exclusiva.
                </p>
            </section>

            <section className = "products-grid">
                {produtos.map((produto, index) => (
                    <article key={index}
                             className={`product-card ${produto.isRecomendado ? "product-card--highlight" : ""}`}
                    >
                        {produto.isRecomendado && (
                            <span className="product-badge">
                                Recomendação Exclusiva - Nome da Empresa
                            </span>
                        )}


                        <div className="product-card-body">
                          <div className = "product-image-wrapper">
                                <img 
                                  src={produto.imagem}
                                  alt={produto.nome}
                                  className="product-image"
                                  />
                          </div>



                          <h2 className  = "product-name"> {produto.nome}</h2>
                          <p className = "product-description">
                             Solução moderna, funcional e ideial para compor ambientes com conforto e estilo
                          </p>

                          <button className='product-button'> Ver detalhes</button>
                        </div>
                    </article>
                ))}
            </section>
        </div>

      <Footer/>
  </>
  )
}

export default Products
