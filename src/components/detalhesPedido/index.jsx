import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { X, ClipboardList, Package, Clock, AlertTriangle, Search } from "lucide-react";
import "./style.css";

function DetalhesModal({ open, onClose, details }) {
  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("");


  useEffect(() => {
    if (!open || !details?.id) return;
    setDetalhe(null);
    setErro("");
    setLoading(true);

    api
      .get(`/pedidos/${details.id}`)
      .then((resp) => setDetalhe(resp.data))
      .catch(() => setErro("Não foi possível carregar os detalhes do pedido."))
      .finally(() => setLoading(false));
  }, [open, details?.id]);


  const header = useMemo(() => {
    const src = detalhe ?? details ?? {};
    return {
      id: details?.id ?? src.id ?? "—",
      status: src.status ?? details?.status ?? "—",
      created_at: src.created_at ?? details?.created_at ?? new Date().toISOString(),
      total: Number(src.valor_total_calculado ?? details?.valor_total_calculado ?? 0),
    };
  }, [detalhe, details]);


  const itensFiltrados = useMemo(() => {
    const itens = detalhe?.itens ?? [];
    const termo = filtro.trim().toLowerCase();
    if (!termo) return itens;
    return itens.filter((it) => {
      const texto = [
        it.tipos?.nome,
        it.grupos?.nome,
        it.linhas?.nome,
        it.colecoes?.nome,
        it.cores?.nome,
        it.acionamentos?.nome,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return texto.includes(termo);
    });
  }, [detalhe, filtro]);

  if (!open) return null;

  return (
    <div className="odm-overlay" onClick={onClose}>
      <div className="odm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="odm-header">
          <div className="odm-title">
            <ClipboardList size={22} />
            Pedido #{header.id}
          </div>
          <button className="odm-close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="odm-content">
          <div class= "odm-summary-row">
            <div className="odm-summary">
                <span className={`odm-status ${String(header.status).toLowerCase()}`}>{header.status}</span>
                <span className="odm-date">
                  <Clock size={16} />
                  {new Date(header.created_at).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                <span className="odm-total">
                  {header.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                </div>
          

                
              {!!(detalhe?.itens?.length) && (
                <div className="odm-filter">
                  <Search size = {28}/>
                  <input
                    type="text"
                    placeholder="Filtre item por nome, cor, coleção..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </div>
              )}
          </div>

          {loading && <p className="odm-loading">Carregando detalhes...</p>}
          {!!erro && (
            <p className="odm-error">
              <AlertTriangle size={16} /> {erro}
            </p>
          )}

          {(!loading && itensFiltrados.length === 0) ? (
            <div className="odm-fallback">
              <p>{filtro.trim() ? "Nenhum item encontrado para o filtro informado." : "Nenhum item para exibir."}</p>
            </div>
          ) : (
            <div className="odm-items">
              {itensFiltrados.map((it) => (
                <div key={it.id} className="odm-item">
                  <div className="odm-item-header">
                    <Package size={18} />
                    <strong>
                      {it.tipos?.nome} {it.grupos?.nome ? `• ${it.grupos?.nome}` : ""}{" "}
                      {it.linhas?.nome ? `• ${it.linhas?.nome}` : ""} • {it.colecoes?.nome}
                    </strong>
                  </div>

                  <table className="odm-table">
                    <thead>
                      <tr>
                        <th>Dimensões</th>
                        <th>Cor</th>
                        <th>Acionamento</th>
                        <th>Qtd</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{it.largura}m x {it.altura}m</td>
                        <td>{it.cores?.nome}</td>
                        <td>{it.acionamentos?.nome}</td>
                        <td>{it.quantidade}</td>
                        <td>
                          {(() => {
                            const totalItem = Number(it.preco_calculado_item) || 0;
                            const totalAcessorios = (it.acessorios || []).reduce(
                              (acc, a) => acc + (Number(a.valor_custo) || 0),
                              0
                            );
                            const subtotalSemAcessorios = totalItem - totalAcessorios;
                            return subtotalSemAcessorios.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            });
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {it.acessorios?.length ? (
                    <div className="odm-accessories">
                      <strong>Acessórios</strong>
                      <ul>
                        {it.acessorios.map((acc, idx) => (
                          <li key={idx}>
                            {acc.nome}
                            {acc.valor_custo != null
                              ? ` — ${Number(acc.valor_custo).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="odm-accessories muted">Sem acessórios</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesModal;
