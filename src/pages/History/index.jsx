import { useEffect, useState } from 'react'
import api from '../../services/api'
import './style.css'
import { Clock, ClipboardList, DollarSign } from 'lucide-react'
import DetalhesModal from '../../components/detalhesPedido'



function History() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() =>{
     const fetchPedidos = async () =>{
      try {
        const response = await api.get("/pedidos")
        setPedidos(response.data)
      } catch (err) {
        console.error("Erro ao carregar histórico:", err)
        setError("Não foi possível carregar os pedidos.")
      } finally {
        setLoading(false)
      }
     }

     fetchPedidos()
  }, [])

  const abrirDetalhe = (p) => { setSelected(p); setOpen(true)}
  const fecharDetalhe = () => { setOpen(false); setSelected(null)}

  if (loading) {
    return <p class = "history-loading"> Carregando histórico</p>
  }

  if (erro) {
     return <p class = "history-error">{erro}</p>
  }

  if (!pedidos.length) {
    return (
      <div class = "history-empty">
        <ClipboardList size = {42} color="#ff8c00db"/>
        <p>Você ainda não tem nenhum pedido realizado.</p>
      </div>
    )
  }

  return (     
     <div class = "history-container">
        <h2 class= "history-title">
          <ClipboardList class = "icon-hi" size = {28}/>
          Histórico de pedidos
        </h2>
          <div class = "history-list">
              {pedidos.map((p) => (
                <div key ={p.id} class = "history-card" onClick={() => abrirDetalhe(p)}>
                    <div class = "history-card-header">
                    <h3>Pedido #{p.id}</h3>
                      <span class = {`status ${p.status.toLowerCase()}`}> 
                        {p.status}
                      </span>
                    </div>

                    <div class = "h-card-body">
                      <p>
                        <Clock size = {16}/>{" "}
                        {new Date(p.created_at).toLocaleString("pt-BR", {
                          dateStyle : "short",
                          timeStyle: "short",
                        })}
                      </p>
                      <p>
                          <DollarSign size={16}/>{" "}
                          <strong>
                            {Number(p.valor_total_calculado).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL"
                            })}
                          </strong>
                      </p>
                    </div>
                </div>
              ))}
          </div>
              
          <DetalhesModal
              open={open}
              onClose = {fecharDetalhe}
              details = {selected}
          />
      
      </div>
  )
}

export default History
