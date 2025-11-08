import { useState, useEffect} from "react";
import { CircleDollarSign } from "lucide-react";
import "./style.css"
import api from "../../services/api"
import SelectSearch from "../../components/SearchbleSelect";


function PriceTable() {

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todos")
  const [load, setLoad] = useState(true)
  const [error, setError] = useState("")

  useEffect(()=> {
    const fetchProdutos = async () => {
        try {
            const response = await api.get("/formulario_pedido/tabela-de-precos")
            setProducts(response.data || [])
        } catch (err) {
            setError("Erro ao carregar tabela.")
            console.error(err)
        } finally {
            setLoad(false)
        }
    }

    fetchProdutos()
  }, [])

  const filteredProducts = products.filter((product) => {
        
        const macthName = product.tipo.toLowerCase().includes(search.toLowerCase()) ||
                          product.colecao.toLowerCase().includes(search.toLocaleLowerCase()) ||
                          product.grupo.toLowerCase().includes(search.toLocaleLowerCase()) ||
                          product.linha.toLowerCase().includes(search.toLocaleLowerCase())



        const macthCategory = category == "Todos" || product.tipo === category
        
        return macthName && macthCategory
  })

  const categories = ["Todos", ...new Set(products.map((p) => p.tipo))]


   if (load) return <p class = "loading">Carregando tabela...</p>
   if (error) return <p class = "t-error">{error}</p>


    return (
        <div class = "table-container"> 
            <div class = "table-top">
                 <h2 class = "table-title">Tabela de Preços</h2>
                <CircleDollarSign size={50} class = "tb-icon"/>
            </div>
           

            <div class = "filters"> 
                <input type="text" 
                       placeholder="Pesquisar produto..."
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       class = "search-input"
                />

                <SelectSearch
                    placeholder="Busque o tipo"
                    options={categories.map((c) => ({id: c, nome: c}))}
                    valueId={category}
                    onChangeValue={(v) => setCategory(v)}
                    className = "category-select"
                    usePortal = {false}
                    />
            </div>


            <div class = "table">
                <div class = "table-header">
                    <span>ID</span>
                    <span>Tipo</span>
                    <span>Grupo</span>
                    <span>Linha</span>
                    <span>Coleção</span>
                    <span>Preço Base (m²)</span>
                </div>
            </div>

            {filteredProducts.map((products, index) => (
                <div key={index} class = "rows">
                    <span>{products.codigo_interno_csv}</span>
                    <span>{products.tipo}</span>
                    <span>{products.grupo}</span>
                    <span>{products.linha}</span>
                    <span>{products.colecao}</span>
                    <span>{products.preco_m2?.toFixed(2)} R$</span>
                </div>
            ))}

            {filteredProducts.length === 0 && (
                <p class = "no-results"> Nehum produto encontrada.</p>
            )}
        </div>
    )
}

export default PriceTable