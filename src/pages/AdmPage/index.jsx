import { ClipboardList, Users, ArrowRight, XCircle, CheckCircle, Search, Loader2, Dice1 } from "lucide-react"
import { useState, useEffect } from "react"
import "./style.css"
import api from "../../services/api"


function AdmPage() {
    const [modalAberto, setModalAberto] = useState(false)
    const [clientes, setClientes] = useState([])
    const [filtro, setFiltro] = useState("")
    const [loading, setLoading] = useState(false)
    const [clienteEditando, setClienteEditando] = useState(null)
    const [novoStatus, setNovosStatus] = useState("")

    useEffect(() => {
       const buscarClientes = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const response = await api.get("/clientes_cadastrados", {
                headers: {Authorization: `Bearer ${token}`}
            })
            setClientes(response.data)
        } catch(err) {
            console.error("Erro ao buscar clientes:", err)
        } finally {
            setLoading(false)
        }
       }

       if (modalAberto) buscarClientes()
    }, [modalAberto])

    const clientesFiltrados = clientes.filter((c) =>
        c.name.toLowerCase().includes(filtro.toLocaleLowerCase())
    )

    const editarStatus = (cliente) => {
        setClienteEditando(cliente)
        setNovosStatus(cliente.status)
    }

    const salvarStatus = async () => {
        try {
            setLoading(true);
            // await api.put(`/clientes/${clienteEditando.id}`, { status: novoStatus });
            setClientes((prev) =>
                prev.map((c) =>
                    c.id === clienteEditando.id ? { ...c, status: novoStatus } : c
                )
            );
            setClienteEditando(null);
        } catch (err) {
            console.error("Erro ao atualizar status:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="adm-container">
            <h1 class="adm-title"> Painel do Administrador</h1>
            <p class="adm-subtilte">
                Selecione uma das opções abaixo para gerenciar o sistema.
            </p>

            <div class="adm-options">
                <div class="adm-card">
                    <div class="adm-icon">
                        <ClipboardList size={40} />
                    </div>
                    <div class="adm-info">
                        <h2>Gerenciar Orçamentos</h2>
                        <p>Visualize e atualize o status dos orçamentos eviados.</p>
                    </div>
                    <ArrowRight class="adm-arrow" />
                </div>

                <div class="adm-card" onClick={() => setModalAberto(true)}>
                    <div class="adm-icon">
                        <Users size={40} />
                    </div>

                    <div class="adm-info">
                        <h2> Gerenciar Clientes</h2>
                        <p>Aprove ou reprove cadastros pendentes de novos lojistas.</p>
                    </div>
                    <ArrowRight class="adm-arrow" />
                </div>
            </div>
            {modalAberto && (
                <div class = "adm-overlay" onClick={() => setModalAberto(false)}>
                    <div class = "adm-modal large" onClick={(e) => e.stopPropagation()}>
                        <div class = "admo-header">
                            <h2>
                                <Users size = {22}/> Lista de Clientes
                            </h2>
                            <button
                                class = "close-btn"
                                onClick={() => setModalAberto(false)}
                            >
                                <XCircle size = {22}/>
                            </button>
                        </div>

                        <div class = "search-bar inside-modal">
                            <Search size ={18}/>
                            <input 
                                type="text"
                                placeholder="Filtrar clientes..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)} 
                            />
                        </div>

                        {loading ? (
                            <div class = "loading">
                                <Loader2 class  = "spin"/> Carregando...
                            </div>
                        ) : (
                           <div class = "table-scroll">
                           <table class = "clientes-table modal view">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientesFiltrados.map((c) => (
                                        <tr key={c.id}>
                                                <td>{c.name}</td>
                                                <td>{c.email}</td>
                                                <td>
                                                    <span className={`status-badge ${c.status}`}>
                                                    {c.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="editar-btn"
                                                        onClick={() => editarStatus(c)}
                                                    >
                                                    Editar
                                                    </button>
                                                </td>            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}  

                        {clienteEditando && (
                            <div class = "submodal">
                                <h3> Editar status de {clienteEditando.name}</h3>
                                <select 
                                    value = {novoStatus}
                                    onChange={(e) => setNovosStatus(e.target.value)}
                                >   
                                    <option value="pendente">Pendente</option>
                                    <option value="aprovado">Aprovado</option>
                                    <option value="reprovado">Reprovado</option> 
                                </select>
                                <div class ="submodal-close">
                                    <button 
                                        onClick={() => setClienteEditando(null)}
                                        class = "cancelar-btn"
                                        >
                                          <XCircle size={16}/> Cancelar
                                    </button>
                                    <button onClick={salvarStatus} class = "salvar-btn">
                                        <CheckCircle size ={16}/> Salvar
                                    </button>
                                </div>
                            </div>
                        )

                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdmPage