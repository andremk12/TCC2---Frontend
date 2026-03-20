import { useState, useEffect } from "react";
import { CircleDollarSign } from "lucide-react";
import "./style.css";
import api from "../../services/api";
import SelectSearch from "../../components/SearchbleSelect";

function PriceTable() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [load, setLoad] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("precos");
  const [tipos, setTipos] = useState([]);

  const [acionamentos, setAcionamentos] = useState([]);
  const [acessorios, setAcessorios] = useState([]);

  useEffect(() => {
    if (category !== "Todos") {
      setActiveTab("acionamentos");
    }
  }, [category]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await api.get("/formulario_pedido/tipos");
        setTipos(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/formulario_pedido/tabela-de-precos");
        setProducts(response.data || []);
      } catch (err) {
        setError("Erro ao carregar tabela.");
        console.error(err);
      } finally {
        setLoad(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        if (category === "Todos") {
          setAcionamentos([]);
          setAcessorios([]);
          return;
        }

        if (!tipos.length) return;

        const tipoSelecionado = tipos.find((t) => t.nome === category);

        if (!tipoSelecionado) return;

        const tipo_id = tipoSelecionado.id;

        const [resAc, resAcc] = await Promise.all([
          api.get(`/formulario_pedido/acionamentos/${tipo_id}`),
          api.get(`/formulario_pedido/acessorios/${tipo_id}`),
        ]);

        setAcionamentos(resAc.data || []);
        setAcessorios(resAcc.data || []);
      } catch (err) {
        console.error("Erro ao carregar", err);
      }
    };
    fetchExtras();
  }, [category, tipos]);

  const filteredProducts = products.filter((product) => {
    const macthName =
      product.tipo.toLowerCase().includes(search.toLowerCase()) ||
      product.colecao.toLowerCase().includes(search.toLocaleLowerCase()) ||
      product.grupo.toLowerCase().includes(search.toLocaleLowerCase()) ||
      product.linha.toLowerCase().includes(search.toLocaleLowerCase());

    const macthCategory = category == "Todos" || product.tipo === category;

    return macthName && macthCategory;
  });

  const categories = ["Todos", ...new Set(products.map((p) => p.tipo))];

  if (load) return <p class="loading">Carregando tabela...</p>;
  if (error) return <p class="t-error">{error}</p>;

  const searchOptions = products.map((p) => ({
    id: `${p.tipo} ${p.grupo} ${p.linha} ${p.colecao}`,
    nome: `${p.tipo} - ${p.grupo} - ${p.linha} - ${p.colecao}`,
  }));

  return (
    <div className="table-container">
      {/* HEADER */}
      <div className="table-top">
        <h2 className="table-title">Tabela de Preços</h2>
        <CircleDollarSign size={50} className="tb-icon" />
      </div>

      {/* FILTROS */}
      <div className="filters">
        <SelectSearch
          placeholder="Buscar produto..."
          options={searchOptions}
          valueId={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          usePortal={false}
        />

        <SelectSearch
          placeholder="Busque o tipo"
          options={categories.map((c) => ({ id: c, nome: c }))}
          valueId={category}
          onChangeValue={(v) => setCategory(v)}
          className="category-select"
          usePortal={false}
        />
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "precos" ? "active" : ""}
          onClick={() => setActiveTab("precos")}
        >
          💲 Tabela
        </button>

        <button
          className={activeTab === "acionamentos" ? "active" : ""}
          onClick={() => setActiveTab("acionamentos")}
          disabled={category === "Todos"}
        >
          ⚙️ Acionamentos
        </button>

        <button
          className={activeTab === "acessorios" ? "active" : ""}
          onClick={() => setActiveTab("acessorios")}
          disabled={category === "Todos"}
        >
          🧩 Acessórios
        </button>
      </div>

      {/* ===================== */}
      {/* ABA: TABELA DE PREÇOS */}
      {/* ===================== */}
      {activeTab === "precos" && (
        <>
          <div className="table">
            <div className="table-header">
              <span>ID</span>
              <span>Tipo</span>
              <span>Grupo</span>
              <span>Linha</span>
              <span>Coleção</span>
              <span>Preço Base (m²)</span>
            </div>
          </div>

          <div className="table-wrapper">
            {filteredProducts.map((product, index) => (
              <div key={index} className="rows">
                <span data-label="🆔 ID">{product.codigo_interno_csv}</span>

                <span data-label="📦 Tipo">{product.tipo}</span>

                <span data-label="🧩 Grupo">{product.grupo}</span>

                <span data-label="🏷️ Linha">{product.linha}</span>

                <span data-label="🎨 Coleção">{product.colecao}</span>

                <span data-label="💲 Preço Base (m²)">
                  {product.preco_m2?.toFixed(2)} R$
                </span>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="no-results">Nenhum produto encontrado.</p>
          )}
        </>
      )}

      {/* ===================== */}
      {/* ABA: ACIONAMENTOS */}
      {/* ===================== */}
      {activeTab === "acionamentos" && (
        <div className="extra-table">
          <div className="extra-header">
            <span>Nome</span>
            <span>Valor</span>
          </div>

          {acionamentos.map((item, index) => (
            <div key={index} className="extra-row">
              <span data-label="⚙️ Nome">{item.nome}</span>

              <span data-label="💲 Valor">
                {item.preco_adicional_fixo?.toFixed(2)} R$
              </span>
            </div>
          ))}

          {category === "Todos" && (
            <p className="no-results">
              Selecione um tipo para ver os acionamentos.
            </p>
          )}

          {category !== "Todos" && acionamentos.length === 0 && (
            <p className="no-results">Nenhum acionamento encontrado.</p>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* ABA: ACESSÓRIOS */}
      {/* ===================== */}
      {activeTab === "acessorios" && (
        <div className="extra-table">
          <div className="extra-header">
            <span>Nome</span>
            <span>Valor m²</span>
            <span>Gatilho m²</span>
            <span>Valor fixo </span>
          </div>

          {acionamentos.map((item) => (
            <div key={item.id} className="extra-row">
              <span data-label="⚙️ Nome">{item.nome}</span>

              <span data-label="💲 Valor m²">
                {item.valor_custo_m2 > 0
                  ? `R$ ${item.valor_custo_m2.toFixed(2)}`
                  : "-"}
              </span>

              <span data-label="📏 Gatilho">
                {item.gatilho_area_m2 > 0 ? `${item.gatilho_area_m2} m²` : "-"}
              </span>

              <span data-label="📦 Valor Fixo">
                {item.preco_adicional_fixo > 0
                  ? `R$ ${item.preco_adicional_fixo.toFixed(2)}`
                  : "-"}
              </span>
            </div>
          ))}

          {category === "Todos" && (
            <p className="no-results">
              Selecione um tipo para ver os acessórios.
            </p>
          )}

          {category !== "Todos" && acessorios.length === 0 && (
            <p className="no-results">Nenhum acessório encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PriceTable;
