import {
  ClipboardList,
  Users,
  ArrowRight,
  XCircle,
  CheckCircle,
  Search,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./style.css";
import api from "../../services/api";

function AdmPage() {
  const [modalAberto, setModalAberto] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [filtro, setFiltro] = useState("");


  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingOrcamentos, setLoadingOrcamentos] = useState(false);

  const [clienteEditando, setClienteEditando] = useState(null);
  const [orcamentoEditando, setOrcamentoEditando] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");

  const [salvarStatus, setSalvarStatus] = useState(false)
  const [erroStatus, setErroStatus] = useState("")

  const [sucessoStatus, setSucessoStatus] = useState(false)
  const [toast, setToast] = useState(null)

  const [salvandoPedido, setSalvandoPedido] = useState(false);
  const [erroPedido, setErroPedido] = useState("");


  useEffect(() => {
    const buscarClientes = async () => {
      setLoadingClientes(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/clientes_cadastrados", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      } finally {
        setLoadingClientes(false);
      }
    };

    if (modalAberto === "clientes") buscarClientes();
  }, [modalAberto]);


 useEffect(() => {
  const buscarPedidos = async () => {
    setLoadingOrcamentos(true)
    try {
      const response = await api.get("/adm/pedidos")
      setOrcamentos(response.data || [])
    } catch (err) {
       console.error("Erro ao buscar pedidos:", err)
    } finally {
      setLoadingOrcamentos(false)
    }
  }

  if (modalAberto === "orcamentos") {
    buscarPedidos()
  }
 }, [modalAberto])

function getStatusClass(status) {
  if (!status) return "";
  return String(status)
    .toLowerCase()
    .normalize("NFD")              // tira acentos (Orçamento -> Orcamento)
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");         // espaços viram hífen (em análise -> em-analise)
}

  const clientesFiltrados = clientes.filter((c) =>
    c.name?.toLowerCase().includes(filtro.toLowerCase())
  );
  const orcamentosFiltrados = orcamentos.filter((o) =>
    o.cliente?.toLowerCase().includes(filtro.toLowerCase())
  );


  const editarStatusCliente = (cliente) => {
    setClienteEditando(cliente);
    setNovoStatus(cliente.status);
  };

  async function  atualizarStatusCliente(id, status) {
    const token = localStorage.getItem("token")

    return api.put( `/adm/clientes/status/${id}`, { status }, {headers: { Authorization: `Bearer ${token}`}})
  }

   const salvarStatusCliente = async () => {
    if (!clienteEditando) return;
    setErroStatus("");
    setSalvarStatus(true);

    const idAlvo = clienteEditando.id;
    const statusAnterior = clienteEditando.status;

    setClientes((prev) =>
      prev.map((c) => (c.id === idAlvo ? { ...c, status: novoStatus } : c))
    );

    try {
      await atualizarStatusCliente(idAlvo, novoStatus);

      setSucessoStatus(true);
      setToast("Status atualizado com sucesso!")

      setTimeout(() => {
          setClienteEditando(null)
      }, 900)

      setTimeout(() => setToast(null), 3000)
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
      const msg =
        e?.response?.data?.erro ||
        e?.message ||
        "Não foi possível atualizar o status.";
      setErroStatus(msg);

      // rollback
      setClientes((prev) =>
        prev.map((c) => (c.id === idAlvo ? { ...c, status: statusAnterior } : c))
      );
    } finally {
      setSalvarStatus(false);
    }
  };

  


  // 🔹 Editar status orçamento
  const editarStatusOrcamento = (orcamento) => {
    setOrcamentoEditando(orcamento);
    setNovoStatus(orcamento.status);
 
  };

  async function atualizarStatusPedido(id, status) {
        return api.put(`/adm/pedidos/status/${id}`, {status})
  }
  
const salvarStatusOrcamento = async () => {
  if (!orcamentoEditando) return;

  setErroPedido("");
  setSalvandoPedido(true);

  const idAlvo = orcamentoEditando.id;
  const statusAnterior = orcamentoEditando.status;

  // 🔹 Atualização otimista na lista da tela
  setOrcamentos((prev) =>
    prev.map((o) =>
      o.id === idAlvo ? { ...o, status: novoStatus } : o
    )
  );

  try {
    await atualizarStatusPedido(idAlvo, novoStatus);

    setToast("Status do pedido atualizado com sucesso!");
    setTimeout(() => setToast(null), 3000);

    // fecha submodal
    setOrcamentoEditando(null);
  } catch (e) {
    console.error("Erro ao atualizar status do pedido:", e);
    const msg =
      e?.response?.data?.erro ||
      e?.message ||
      "Não foi possível atualizar o status do pedido.";
    setErroPedido(msg);

    // 🔁 rollback se der erro
    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === idAlvo ? { ...o, status: statusAnterior } : o
      )
    );
  } finally {
    setSalvandoPedido(false);
  }
};

  // 🔹 Fecha modal de forma segura
  const fecharModal = () => {
    setModalAberto(null);
    setClienteEditando(null);
    setOrcamentoEditando(null);
    setFiltro("");
  };

  return (
    <div className="adm-container">
      
      {toast && <div class = "toast success">{toast}</div>}

      <h1 className="adm-title">Painel do Administrador</h1>
      <p className="adm-subtitle">
        Selecione uma das opções abaixo para gerenciar o sistema.
      </p>

      <div className="adm-options">
        {/* 🧾 Gerenciar Orçamentos */}
        <div
          className="adm-card"
          onClick={() => {
            setFiltro("");
            setModalAberto("orcamentos");
          }}
        >
          <div className="adm-icon">
            <ClipboardList size={40} />
          </div>
          <div className="adm-info">
            <h2>Gerenciar Orçamentos</h2>
            <p>Visualize e atualize o status dos orçamentos enviados.</p>
          </div>
          <ArrowRight className="adm-arrow" />
        </div>

        {/* 👥 Gerenciar Clientes */}
        <div
          className="adm-card"
          onClick={() => {
            setFiltro("");
            setModalAberto("clientes");
          }}
        >
          <div className="adm-icon">
            <Users size={40} />
          </div>
          <div className="adm-info">
            <h2>Gerenciar Clientes</h2>
            <p>Aprove ou reprove cadastros pendentes de novos lojistas.</p>
          </div>
          <ArrowRight className="adm-arrow" />
        </div>
      </div>

      {/* 🧍 MODAL DE CLIENTES */}
      {modalAberto === "clientes" && (
        <div
          className="adm-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("adm-overlay")) fecharModal();
          }}
        >
          <div className="adm-modal large" onClick={(e) => e.stopPropagation()}>
            <div className="admo-header">
              <h2>
                <Users size={22} /> Lista de Clientes
              </h2>
              <button className="close-btn" onClick={fecharModal}>
                <XCircle size={22} />
              </button>
            </div>

            <div className="search-bar inside-modal">
              <Search size={18} />
              <input
                type="text"
                placeholder="Filtrar clientes..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            {loadingClientes ? (
              <div className="loading">
                <Loader2 className="spin" /> Carregando...
              </div>
            ) : (
              <div className="table-scroll">
                <table className="clientes-table modal-view">
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
                            onClick={() => editarStatusCliente(c)}
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
              <div className="submodal">
                <h3>Editar status de {clienteEditando.name}</h3>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <div className="submodal-close">
                  <button
                    onClick={() => setClienteEditando(null)}
                    className="cancelar-btn"
                    disabled={salvarStatus}
                  >
                    <XCircle size={16} /> Cancelar
                  </button>
                  <button onClick={salvarStatusCliente} className={`salvar-btn ${sucessoStatus ? "succces": ""}`} disabled={salvarStatus}>
                       {salvarStatus ? (
                            <>
                              <Loader2 className="spin" size={16} /> Salvando...
                            </>
                          ) : sucessoStatus ? (
                            <>
                              <CheckCircle size={16} /> Salvo!
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} /> Salvar
                            </>
                        )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 MODAL DE ORÇAMENTOS */}
      {modalAberto === "orcamentos" && (
        <div
          className="adm-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("adm-overlay")) fecharModal();
          }}
        >
          <div className="adm-modal large" onClick={(e) => e.stopPropagation()}>
            <div className="admo-header">
              <h2>
                <ClipboardList size={22} /> Lista de Orçamentos
              </h2>
              <button className="close-btn" onClick={fecharModal}>
                <XCircle size={22} />
              </button>
            </div>

            <div className="search-bar inside-modal">
              <Search size={18} />
              <input
                type="text"
                placeholder="Filtrar por cliente..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            {loadingOrcamentos ? (
              <div className="loading">
                <Loader2 className="spin" /> Carregando...
              </div>
            ) : (
              <div className="table-scroll">
                <table className="clientes-table modal-view">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>CNPJ</th>
                          <th>Status</th>
                          <th>Valor total</th>
                          <th>Data</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orcamentosFiltrados.map((o) => (
                          <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.cliente}</td>
                            <td>{o.cnpj || "-"}</td>
                            <td>
                              <span className={`status-badge ${getStatusClass(o.status)}`}>
                                {String(o.status || "").toUpperCase()}
                              </span>
                            </td>
                            <td>
                              R$ {Number(o.total || 0).toFixed(2).replace(".", ",")}
                            </td>
                            <td>
                              {o.data
                                ? new Date(o.data).toLocaleDateString("pt-BR")
                                : "-"}
                            </td>
                            <td>
                              <button
                                className="editar-btn"
                                onClick={() => editarStatusOrcamento(o)}
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}

                        {orcamentosFiltrados.length === 0 && !loadingOrcamentos && (
                          <tr>
                            <td colSpan={7} style={{ textAlign: "center" }}>
                              Nenhum pedido encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

              </div>
            )}

            {orcamentoEditando && (
              <div className="submodal">
                <h3>Editar status do orçamento</h3>
                <p>
                  <strong>{orcamentoEditando.cliente}</strong>
                </p>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="em análise">Em análise</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="recusado">Recusado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
                <div className="submodal-close">
                  <button
                    onClick={() => setOrcamentoEditando(null)}
                    className="cancelar-btn"
                  >
                    <XCircle size={16} /> Cancelar
                  </button>
                  <button onClick={salvarStatusOrcamento} className="salvar-btn">
                    <CheckCircle size={16} /> Salvar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmPage;
