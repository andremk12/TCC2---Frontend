import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import "./style.css";
import { PlusCircle, Trash2, Send, Package, User, Copy } from "lucide-react";
import SelectSearch from "../../components/SearchbleSelect";
import OrderPup from "../../components/poupUps/popUpPedido";


const getNomeById = (array, id) => {
  if (!array || !id) return '';
  const encontrado = array.find(item => String(item.id) === String(id));
  return encontrado?.nome || '';
};

const vazioDeOpcoes = {
  grupos: [],
  linhas: [],
  colecoes: [],
  cores: [],
  acionamentos: [], 
  acessorios: [],
};

function Order() {
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [showPop, setShowPop] = useState(false);
  const [pedidoID, sePedidoID] = useState(null);
  
  const [precos, setPrecos] = useState([]); 
  const [total, setTotal] = useState(0);

  const novoItem = () => ({
    _localId: crypto.randomUUID?.() || String(Date.now() + Math.random()),
    tipo: "",
    grupo: "",
    linha: "",
    colecao: "",
    cor: "",
    acionamento: "", 
    acessorios: [],   
    quantidade: 1,
    largura: "",  
    altura: "",         
  });

  const [dadosPedido, setDadosPedido] = useState([novoItem()]);
  const [tipos, setTipos] = useState([]);

  const [opcoesBasePorItem, setOpcoesBasePorItem] = useState([{ acionamentos: [], acessorios: [] }]);
  const [optionsByItem, setOptionsByItem] = useState([{ ...vazioDeOpcoes }]);

  const [erro, setErro] = useState("")
  const [type, setType] = useState("sucesso")
  const [show, setShow] = useState(false)

  // Efeito 1: Busca dados iniciais
  useEffect(() => {
    // 1. Busca dados do usuário
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/login/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();

    setId(`PED-${Math.floor(Math.random() * 1_000_000)}`);

    // 2. Busca Tipos
    const fetchTipos = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/formulario_pedido/tipos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTipos(data || []);
      } catch (error) {
        console.error("Erro ao buscar tipos:", error);
      }
    };
    fetchTipos();

    // 3. Busca a Tabela de Preços (AGORA COM IDs)
 const fetchTabela = async () =>{
    try {
       const token = localStorage.getItem("token");
       const { data } = await api.get("/formulario_pedido/precos-base-ids", { // <-- MUDANÇA AQUI
          headers: {Authorization: `Bearer ${token}`},
        });
        setPrecos(data || []);
  } catch (err) {
     console.error("Erro ao consultar tabela de preços base:", err); // <-- MUDANÇA AQUI
 }
   }
 fetchTabela();
  }, []);

  const calcularPrecoUnitario = useCallback((item, opts, optsBase) => {
  if (!opts || !optsBase) return 0; 
     const optsSeguro = {
       // Deixamos isso pois ainda é útil para Acionamentos e Acessórios
         acionamentos: optsBase.acionamentos || [], 
         acessorios: optsBase.acessorios || []
     };

    if (!item.tipo || !item.linha || !item.colecao || !item.cor || !item.acionamento || !item.largura || !item.altura || !precos.length) {
      return 0;
    }

    let precoFinalItem = 0;
    const areaMinima = 1.5;
    const larguraNum = parseFloat(String(item.largura).replace(',', '.')) || 0; 
    const alturaNum = parseFloat(String(item.altura).replace(',', '.')) || 0;

     const areaBruta = larguraNum * alturaNum;
     if (areaBruta === 0) return 0;
 
     const areaCalculada = Math.max(areaBruta, areaMinima);

     // 1. ACHAR PREÇO BASE (m²) - LÓGICA NOVA (COM IDs)
    // Não precisamos mais de getNomeById(tipos, item.tipo), etc.

    const precoRegra = precos.find((p) => {
        const tipoMatch = p.tipo_id == item.tipo;
         const colecaoMatch = p.colecao_id == item.colecao;

         // O 'item.grupo' é "" (falsy) para Romanas ou um ID numérico para outros.
        // Esta lógica lida com ambos os casos perfeitamente.
        const grupoIdParaBusca = item.grupo ? parseInt(item.grupo, 10) : null;
        const grupoMatch = p.grupo_id == grupoIdParaBusca;

         return tipoMatch && colecaoMatch && grupoMatch;
     });
     // --- FIM DA MUDANÇA ---
     
     const preco_m2_base = precoRegra?.preco_m2 || 0;
     if (preco_m2_base === 0) {
       // console.warn("Preço M2 base (ID) não encontrado para:", item.tipo, item.grupo, item.colecao);
       return 0; 
     }

     let precoBaseDoItem = areaCalculada * preco_m2_base;
     precoFinalItem = precoBaseDoItem;

     // 2. ACHAR CUSTO DO ACIONAMENTO (Esta lógica já estava boa)
     const acionamentoObj = (optsSeguro.acionamentos || []).find(a => a.id == item.acionamento);
     if (acionamentoObj) {
         // ... (nenhuma mudança aqui, de 178 a 191) ...
         if (acionamentoObj.tipo_custo_m2 === 'percentual_m2') {
             precoFinalItem += precoBaseDoItem * (Number(acionamentoObj.valor_custo_m2) / 100);
         }
         if (acionamentoObj.tipo_custo_m2 === 'adicional_fixo') {
             precoFinalItem += areaCalculada * Number(acionamentoObj.valor_custo_m2);
         }
         if (acionamentoObj.preco_adicional_fixo > 0) {
             precoFinalItem += Number(acionamentoObj.preco_adicional_fixo);
         }
     }

     // 3. ACHAR CUSTO DOS ACESSÓRIOS (COM CORREÇÃO)
     
     // Primeiro, garantir que 'acessorios_ids' é SEMPRE um array
     let acessorios_ids = [];
     if (Array.isArray(item.acessorios)) {
         acessorios_ids = item.acessorios;
     } else if (item.acessorios) { // Se for um valor único (ex: "23")
         acessorios_ids = [item.acessorios];
     }

     // Agora, podemos fazer o loop com segurança
     if (acessorios_ids.length > 0) {
         acessorios_ids.forEach(acessorio_id => { // <-- Agora é seguro
             const acessorioObj = (optsSeguro.acessorios || []).find(a => a.id == acessorio_id);
             if (acessorioObj) {
                 if (acessorioObj.tipo_custo === 'fixo') {
                     precoFinalItem += Number(acessorioObj.valor_custo);
                 }
                 if (acessorioObj.tipo_custo === 'por_metro_linear') {
                     if (acessorioObj.nome === 'Perfil Guia Lateral Alumínio Branco Completo ML') {
                     precoFinalItem += (larguraNum + (2 * alturaNum)) * Number(acessorioObj.valor_custo);
                     } else {
                         precoFinalItem += larguraNum * Number(acessorioObj.valor_custo);
                     }
                 }
             }
         });
     }
     
     return precoFinalItem; 
   }, [precos]); // <-- A dependência 'tipos' não é mais necessária aqui

 // Efeito 2: Recalcula o preço total (COM PROTEÇÃO E CORREÇÃO)
   useEffect(() => {
     const novoTotal = dadosPedido.reduce((acc, item, i) => {
         const opts = optionsByItem[i] || vazioDeOpcoes; 
         const optsBase = opcoesBasePorItem[i] || { acionamentos: [], acessorios: [] };

         // --- MUDANÇA (CORREÇÃO DA CHAMADA) ---
         // A chamada agora é idêntica à do JSX do Resumo
         const precoUnit = calcularPrecoUnitario(item, opts, optsBase);
         // --- FIM DA MUDANÇA ---

         return acc + precoUnit * (Number(item.quantidade) || 1);
     }, 0);
     setTotal(novoTotal);
   }, [dadosPedido, optionsByItem, opcoesBasePorItem, calcularPrecoUnitario]);

  // Efeito 3 (Filtro de Acionamentos) foi REMOVIDO

  // Função principal de mudança (COM PROTEÇÃO)
  const handleChange = async (index, field, value) => {
    const token = localStorage.getItem("token");

    // 1) Atualizar valores do item no estado
    setDadosPedido(prev => {
      const copia = [...prev];
      if (!copia[index]) return prev; 
      const item = { ...copia[index] };

      if (field === "largura" || field === "altura") {
          item[field] = value.replace(/[^0-9,.]/g, ''); 
          copia[index] = item;
          return copia;
      }
      if (field === "quantidade") {
          item[field] = Math.max(1, Number(value) || 1);
          copia[index] = item;
          return copia; 
      }

      if (field === "acessorios") {
        item.acessorios = Array.isArray(value) ? value : [value]
        copia[index] = item
        return copia
      }

     if (["tipo", "grupo", "linha", "colecao", "cor", "acionamento"].includes(field)) {
    item[field] = value ? String(value) : "";

    // resetar dependentes quando muda nível hierárquico
    const niveisHierarquicos = ["tipo", "grupo", "linha", "colecao", "cor"];
    const idxNivel = niveisHierarquicos.indexOf(field);

    if (idxNivel >= 0) {
            niveisHierarquicos.slice(idxNivel + 1).forEach(n => {
              item[n] = "";
            });

            if (field === "tipo") {
              item["acionamento"] = "";
              item["acessorios"] = [];
            }
            if (field === "grupo") {
              item["acionamento"] = "";
            }
          }

          copia[index] = item;
          return copia;
        }

        // fallback (se algum campo diferente aparecer)
        item[field] = value;
        copia[index] = item;
        return copia;
      });

    // 2) Buscar novas opções da API
    try {
      if (field === "tipo") {
        const [gruposRes, acessoriosRes, acionamentosRes] = await Promise.all([
          api.get(`/formulario_pedido/grupos/${value}`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/formulario_pedido/acessorios/${value}`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/formulario_pedido/acionamentos/${value}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Salva as opções base (completas, sem filtro)
        setOpcoesBasePorItem(prev => {
            const copia = [...prev];
            if (!copia[index]) copia[index] = { acionamentos: [], acessorios: [] };
            copia[index] = {
                acionamentos: acionamentosRes.data || [],
                acessorios: acessoriosRes.data || []
            };
            return copia;
        });

        const eRomana = (gruposRes.data || []).length === 0;

        // Salva as opções de funil
        setOptionsByItem(prev => {
          const copia = prev.map((o, i) => (i === index ? { ...vazioDeOpcoes } : o));
          if (!copia[index]) copia[index] = { ...vazioDeOpcoes };
          copia[index] = {
            ...vazioDeOpcoes,
            grupos: gruposRes.data || [],
            // Acionamentos e Acessórios são populados pelo JSX
          };
          return copia;
        });

        if (eRomana) {
            const { data: linhasRes } = await api.get(`/formulario_pedido/linhas/${value}/null`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOptionsByItem(prev => {
                const copia = [...prev];
                if (!copia[index]) copia[index] = { ...vazioDeOpcoes };
                copia[index] = { ...copia[index], linhas: linhasRes || [] }; 
                return copia;
            });
        }
        
      } else if (field === "grupo") {
        const tipoAtual = dadosPedido[index].tipo;
        const grupoIdParaApi = value || "null"; 
        const { data } = await api.get(`/formulario_pedido/linhas/${tipoAtual}/${grupoIdParaApi}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOptionsByItem(prev => {
          const copia = prev.map((o, i) => (i === index ? { ...o } : o));
          if (!copia[index]) copia[index] = { ...vazioDeOpcoes };
          copia[index] = { 
            ...copia[index], 
            linhas: data || [], 
            colecoes: [], 
            cores: [] 
          };
          return copia;
        });
      } else if (field === "linha") {
        const tipoAtual = dadosPedido[index].tipo;
        const grupoAtual = dadosPedido[index].grupo || "null";
        const { data } = await api.get(`/formulario_pedido/colecoes/${tipoAtual}/${value}/${grupoAtual}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOptionsByItem(prev => {
          const copia = prev.map((o, i) => (i === index ? { ...o } : o));
          if (!copia[index]) copia[index] = { ...vazioDeOpcoes };
          copia[index] = { ...copia[index], colecoes: data || [], cores: [] };
          return copia;
        });
      } else if (field === "colecao") {
        const { data } = await api.get(`/formulario_pedido/cores/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOptionsByItem(prev => {
          const copia = prev.map((o, i) => (i === index ? { ...o } : o));
          if (!copia[index]) copia[index] = { ...vazioDeOpcoes };
          copia[index] = { ...copia[index], cores: data || [] };
          return copia;
        });
      }
    } catch (error) {
      console.error("Erro ao carregar hierarquia:", error);
    }
  };

  const adicionarItem = () => {
    setDadosPedido(prev => [...prev, novoItem()]);
    setOptionsByItem(prev => [...prev, { ...vazioDeOpcoes }]);
    setOpcoesBasePorItem(prev => [...prev, { acionamentos: [], acessorios: [] }]);
  };

  const duplicarItem = (index) => {
    const uid = () => (crypto.randomUUID?.() || String(Date.now() + Math.random()))
 
    if (index < 0 || index >= dadosPedido.length) return;
 
    setDadosPedido((prev) => {
      const original = prev[index]
      const clone = {... original, _localId: uid()}
      const arr = [...prev]
      arr.splice(index + 1, 0, clone)
      return arr
    })
 
    setOptionsByItem((prev) => {
      const originalOpts = prev[index] || {...vazioDeOpcoes}
      const cloneOpts = { ...originalOpts };
      const arr = [...prev]
      arr.splice(index + 1, 0, cloneOpts)
      return arr
    })
    
    setOpcoesBasePorItem((prev) => {
        const originalBaseOpts = prev[index] || { acionamentos: [], acessorios: [] };
        const cloneBaseOpts = { ...originalBaseOpts };
        const arr = [...prev];
        arr.splice(index + 1, 0, cloneBaseOpts);
        return arr;
    });
  };

  const removeItem = (index) => {
    setDadosPedido(prev => prev.filter((_, i) => i !== index));
    setOptionsByItem(prev => prev.filter((_, i) => i !== index));
    setOpcoesBasePorItem(prev => prev.filter((_, i) => i !== index));
  };

  // Função de Envio (SEGURA)
  const enviarPedido = async () => {
    
    const itensParaEnviar = [];
    for (let i = 0; i < dadosPedido.length; i++) {
        const item = dadosPedido[i];
        
        if (!item.tipo || !item.linha || !item.colecao || !item.cor || !item.acionamento) {
            setShow(false)
            setTimeout(() => {
                 setErro(`Erro no Item ${i + 1}: todos os campos obrigatórios devem ser preenchidos.`);
                 setType("erro");
                 setShow(true);
            }, 50)
           
            return; 
        }
        
        const larguraNum = parseFloat(String(item.largura).replace(',', '.')) || 0;
        const alturaNum = parseFloat(String(item.altura).replace(',', '.')) || 0;

        if (larguraNum <= 0 || alturaNum <= 0) {
          setShow(false)   
          setTimeout(() => {
              setErro(`Erro no Item ${i + 1}: largura e altura devem ser maiores que zero.`);
              setType("erro");
              setShow(true);
          }, 50) 
            return;
        }

        const grupoIdNum = item.grupo ? parseInt(item.grupo, 10) : null;
        
        let acessoriosIdsNum = [];
        if (Array.isArray(item.acessorios)) {
            acessoriosIdsNum = item.acessorios.map(id => parseInt(id, 10));
        } else if (item.acessorios) { 
            acessoriosIdsNum = [parseInt(item.acessorios, 10)];
        }

        itensParaEnviar.push({
          tipo_id: parseInt(item.tipo, 10),
          colecao_id: parseInt(item.colecao, 10),
          grupo_id: grupoIdNum,
          cor_id: parseInt(item.cor, 10),
          acionamento_id: parseInt(item.acionamento, 10),
          largura: larguraNum,
          altura: alturaNum,
          quantidade: item.quantidade,
          acessorios_ids: acessoriosIdsNum
        });
    }

    const pacote = {
      cliente_id: user?.id ?? null,
      itens: itensParaEnviar
    };

    try {
      const token = localStorage.getItem("token");

      const { data } = await api.post('/pedidos', pacote, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pid = data?.pedido_id || data?.id || "-";
      sePedidoID(pid);
      setShowPop(true);
      const limparFormulario = () => {
        setDadosPedido([novoItem()]);
        setOptionsByItem([{ ...vazioDeOpcoes }]);
        setOpcoesBasePorItem([{ acionamentos: [], acessorios: [] }]);
        setId(` PED-${Math.floor(Math.random() * 1_000_000)}`);
        setTotal(0)
      }

      setTimeout(() => limparFormulario(), 200)
    
    } catch (error) {
      console.error("Falha ao enviar o pedido:", error);
      const serverMsg = error?.response?.data?.details || error?.response?.data?.error || "Erro ao processar o pedido";
      setErro(`Não foi possível criar o pedido. ${serverMsg}`);
      setType("erro");
      setShow(true);
    }
  };

  // --- HTML / JSX ---

  return (
    <div class="order-container">
      <header class="order-header">
        <Package size={38} class="icon-o" />
        <h1>Novo Pedido</h1>
      </header>

      {user && (
        <section class="primary-infos">
          <div class="user-info">
            <h2><User size={32} class="icon-o" /> Dados do Cliente</h2>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>CNPJ:</strong> {user.cnpj}</p>
            <p><strong>Razão social:</strong> {user.razaosocial}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <div class="pedido-info">
            <p><strong>Número do pedido:</strong> <span>{id}</span></p>
          </div>
        </section>
      )}

      <section class="itens-section">
        <h2>Monte seu Pedido</h2>
        {dadosPedido.map((item, index) => {
          
          // --- MUDANÇA (CORREÇÃO DE CRASH) ---
          // Define os 'guards' (proteções) aqui, antes do return
          const itemOpcoesBase = opcoesBasePorItem[index] || { acionamentos: [], acessorios: [] };
          const itemOpcoesFunil = optionsByItem[index] || { ...vazioDeOpcoes };
          const grupoNome = getNomeById(itemOpcoesFunil.grupos, item.grupo);

          // Filtra os acionamentos de forma segura AQUI
          const acionamentosFiltrados = (itemOpcoesBase.acionamentos || []).filter(ac => {
                if (!ac.nome) return false;
                
                const especificos = ['T-40', 'T-43', 'T-53', '16MM', '25MM', 'Motor'];
                const eEspecifico = especificos.some(term => ac.nome.includes(term));

                if (!eEspecifico) {
                    return true; // É genérico
                }
                if (!grupoNome) {
                    return false; // É específico, mas sem grupo
                }
                if (ac.nome.includes(grupoNome)) {
                    return true; // Bateu (ex: Kit Alívio T-40)
                }
                if (ac.nome.includes('Motor') && (grupoNome === 'T-43' || grupoNome === 'T-53')) {
                    return true; // Exceção do Motor
                }
                return false;
          });
          // --- FIM DA MUDANÇA ---

          return (
            <div key={item._localId} class="item-card">
              <div class="item-header">
                <span>Item {index + 1}</span>
                <div class="buttons">
                  <button class="duplicate-btn" onClick={() =>duplicarItem(index)} title="Duplicar item">
                      <Copy size={20}/>
                  </button>
                  <button class="remove-btn" onClick={() => removeItem(index)} title="Remover item">
                      <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div class="item-fields">
                
                <SelectSearch
                  label="Tipo"
                  isMulti = {false}
                  options={tipos}
                  valueId={item.tipo}
                  onChangeValue={(val) => handleChange(index, "tipo", val)}
                  placeholder="Buscar/selecionar tipo..."
                />
                <div class = "dimensions-container">
                    <div class = "dimension-field">
                          <div class="form-row">
                            <label>Largura (m)</label>
                            <input
                              type="number" 
                              inputMode="decimal"
                              value={item.largura} 
                              placeholder="ex: 1,50"
                              max = {3}
                              onChange={(e) => handleChange(index, "largura", e.target.value)} 
                            />
                          </div>
                          
                        </div>
                        <div class = "dimension-field">
                          <div class="form-row">
                            <label>Altura (m)</label>
                            <input
                              type="number" 
                              inputMode="decimal"
                              value={item.altura} 
                              max = {3}
                              placeholder="ex: 2,20"
                              onChange={(e) => handleChange(index, "altura", e.target.value)}
                            />
                          </div>
                      </div>
                </div>

                {item.tipo && (itemOpcoesFunil.grupos.length > 0) && (
                  <SelectSearch
                    label="Grupos"
                    options={itemOpcoesFunil.grupos}
                    valueId={item.grupo}
                    onChangeValue={(val) => handleChange(index, "grupo", val)}
                    placeholder="Buscar/selecionar grupo..."
                  />
                )}

                {(item.grupo || (item.tipo && itemOpcoesFunil.grupos.length === 0)) && (
                  <SelectSearch
                    label="Linha"
                    options={itemOpcoesFunil.linhas}
                    valueId={item.linha}
                    onChangeValue={(val) => handleChange(index, "linha", val)}
                    placeholder="Buscar/selecionar linha..."
                  />
                )}

                {item.linha && (
                  <SelectSearch
                    label="Coleção"
                    options={itemOpcoesFunil.colecoes}
                    valueId={item.colecao}
                    onChangeValue={(val) => handleChange(index, "colecao", val)}
                    placeholder="Buscar/selecionar colecao..."
                  />
                )}

                {item.colecao && (
                  <SelectSearch
                    label="Cor"
                    options={itemOpcoesFunil.cores}
                    valueId={item.cor}
                    onChangeValue={(val) => handleChange(index, "cor", val)}
                    placeholder="Buscar/selecionar cores..."
                  />
                )}

                {/* --- MUDANÇA (CORREÇÃO DE CRASH) --- */}
                {/* Usa a variável 'acionamentosFiltrados' que criamos acima */}
                {item.tipo && acionamentosFiltrados.length > 0 && (
                  <SelectSearch
                    label="Acionamento"
                    options={acionamentosFiltrados}
                    valueId={item.acionamento}
                    onChangeValue={(val) => handleChange(index, "acionamento", val)}
                    placeholder="Buscar/selecionar acionamento..."
                  />
                )}

                {/* Usa 'itemOpcoesBase' para Acessórios (que já é seguro) */}
                {item.tipo && itemOpcoesBase.acessorios.length > 0 && (
                  <SelectSearch
                    label="Acessórios (Opcional)"
                    isMulti={true} 
                    options={itemOpcoesBase.acessorios}
                    valueId={item.acessorios} 
                    onChangeValue={(val) => handleChange(index, "acessorios", val)} 
                    placeholder="Buscar/selecionar acessórios..."
                  />
                )}
                {/* --- FIM DA MUDANÇA --- */}

                <div class="form-row">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => handleChange(index, "quantidade", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )
        })}

        <button class="add-btn" onClick={adicionarItem}>
          <PlusCircle size={20} /> Adicionar Item
        </button>
      </section>

      <section class="summary-section">
        <div class="summary-card">
          <h3>Resumo do pedido</h3>
          {dadosPedido.map((item, index) => {
            
            // --- MUDANÇA (CORREÇÃO DE CRASH) ---
            // Define 'opts' com um 'guard' para o 'vazioDeOpcoes'
            const opts = optionsByItem[index] || vazioDeOpcoes; 
            const optsBase = opcoesBasePorItem[index] || { acionamentos: [], acessorios: [] };
            // --- FIM DA MUDANÇA ---
            
            const nomeCompleto = [
              getNomeById(tipos, item.tipo),
              getNomeById(opts.grupos, item.grupo),
              getNomeById(opts.linhas, item.linha),
              getNomeById(opts.colecoes, item.colecao),
              getNomeById(opts.cores, item.cor)
            ].filter(Boolean).join(' ');

            const precoUnit = calcularPrecoUnitario(item, opts, optsBase);
            const subtotal = precoUnit * (Number(item.quantidade) || 1);

            return (
              <div key={item._localId} class="summary-item">
                <span title={nomeCompleto}> Item {index + 1}: {nomeCompleto.substring(0, 40) || 'Novo Item...'}...</span>
                <span>
                  {subtotal > 0 ? `R$ ${subtotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                  })}` : (item.cor ? "Calculando..." : "--")}
                </span>
              </div>
            )
          })}
          <div class="summary-total">
            <strong>Total:</strong>
            <span>
              R$ {total.toLocaleString("pt-BR", { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </section>

      <div class="actions">
        <button class="submit-btn" onClick={enviarPedido}>
          <Send size={18} /> Enviar Pedido
        </button>
      </div>

      <OrderPup
        isOpen={showPop}
        onClose={() => setShowPop(false)}
        id={pedidoID}
      />

        {show && (
                <div class ={`mensagem ${type}`}>  
                        {erro}
                </div>
            )}
    </div>
  );
}

export default Order;