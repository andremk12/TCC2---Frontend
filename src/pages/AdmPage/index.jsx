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
  const [modalAberto, setModalAberto] = useState(null); // "clientes" | "orcamentos"
  const [clientes, setClientes] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [filtro, setFiltro] = useState("");

  // ⏳ Estados de carregamento separados
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingOrcamentos, setLoadingOrcamentos] = useState(false);

  const [clienteEditando, setClienteEditando] = useState(null);
  const [orcamentoEditando, setOrcamentoEditando] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");

  // 🔸 Buscar clientes reais
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

  // 🔸 Mock temporário de orçamentos
  useEffect(() => {
    if (modalAberto === "orcamentos") {
      setLoadingOrcamentos(true);
      setTimeout(() => {
        setOrcamentos([
          {
            id: 1,
            cliente: "Loja A",
            total: 1230.5,
            data: "2025-10-20",
            status: "pendente",
          },
          {
            id: 2,
            cliente: "Comercial D",
            total: 2950.0,
            data: "2025-10-28",
            status: "em análise",
          },
          {
            id: 3,
            cliente: "Persianas Luz",
            total: 800.99,
            data: "2025-11-02",
            status: "aprovado",
          },
        ]);
        setLoadingOrcamentos(false);
      }, 800);
    }
  }, [modalAberto]);

  // 🔹 Filtros
  const clientesFiltrados = clientes.filter((c) =>
    c.name?.toLowerCase().includes(filtro.toLowerCase())
  );
  const orcamentosFiltrados = orcamentos.filter((o) =>
    o.cliente?.toLowerCase().includes(filtro.toLowerCase())
  );

  // 🔹 Editar status cliente
  const editarStatusCliente = (cliente) => {
    setClienteEditando(cliente);
    setNovoStatus(cliente.status);
  };

  const salvarStatusCliente = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/clientes/${clienteEditando.id}`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteEditando.id ? { ...c, status: novoStatus } : c
        )
      );
      setClienteEditando(null);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // 🔹 Editar status orçamento
  const editarStatusOrcamento = (orcamento) => {
    setOrcamentoEditando(orcamento);
    setNovoStatus(orcamento.status);
  };

  const salvarStatusOrcamento = () => {
    setOrcamentos((prev) =>
      prev.map((o) =>
        o.id === orcamentoEditando.id ? { ...o, status: novoStatus } : o
      )
    );
    setOrcamentoEditando(null);
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
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                </select>
                <div className="submodal-close">
                  <button
                    onClick={() => setClienteEditando(null)}
                    className="cancelar-btn"
                  >
                    <XCircle size={16} /> Cancelar
                  </button>
                  <button onClick={salvarStatusCliente} className="salvar-btn">
                    <CheckCircle size={16} /> Salvar
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
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentosFiltrados.map((o) => (
                      <tr key={o.id}>
                        <td>{o.cliente}</td>
                        <td>{new Date(o.data).toLocaleDateString("pt-BR")}</td>
                        <td>R$ {o.total.toFixed(2).replace(".", ",")}</td>
                        <td>
                          <span className={`status-badge ${o.status}`}>
                            {o.status.toUpperCase()}
                          </span>
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
