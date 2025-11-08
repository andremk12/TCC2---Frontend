import { useMemo } from "react";
import Select from "react-select";

export default function SelectSearch({
  label,
  options = [],
  valueId,
  onChangeValue,
  placeholder = "Selecione...",
  isDisabled = false,
  className = "",
  usePortal = true,
  isMulti = false
}) {
  // 🔹 Normaliza opções (id + nome flexível)
  const mapped = useMemo(() => {
    return (options || []).map((x) => ({
      value: String(x.id ?? x.value ?? x.codigo ?? x.ID ?? ""), // qualquer formato de id
      label:
        x.nome ??
        x.nome_tipo ??
        x.descricao ??
        x.label ??
        x.nome_linha ??
        x.nome_cor ??
        x.nome_colecao ??
        x.nome_grupo ??
        "Sem nome",
    }));
  }, [options]);

  // 🔹 Normaliza o valor selecionado
  const selected = useMemo(() => {
    if (isMulti) {
      if (!Array.isArray(valueId)) return [];
      const idsAsString = valueId.map((v) => String(v));
      return mapped.filter((opt) => idsAsString.includes(opt.value));
    } else {
      return mapped.find((opt) => String(opt.value) === String(valueId)) || null;
    }
  }, [mapped, valueId, isMulti]);

  const selectStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        borderRadius: 10,
        borderColor: state.isFocused ? "#ff8c00db" : "#dcdcdc",
        boxShadow: state.isFocused ? "0 0 0 3px rgba(255,140,0,.15)" : "none",
        minHeight: 44,
        ":hover": { borderColor: "#ff8c00db" },
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#ff8c00db"
          : state.isFocused
          ? "#fff5e9"
          : "#fff",
        color: state.isSelected ? "#fff" : "#333",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999,
        borderRadius: 10,
        overflow: "hidden",
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
    }),
    []
  );

  return (
    <div className={`form-row ${className}`}>
      {label && <label>{label}</label>}
      <Select
        styles={selectStyles}
        options={mapped}
        value={selected}
        isMulti={isMulti}
        onChange={(opt) => {
          if (isMulti) {
            const values = (opt || []).map((o) => o.value);
            onChangeValue(values);
          } else {
            onChangeValue(opt?.value ?? "");
          }
        }}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={isDisabled}
        noOptionsMessage={() => "Sem opções"}
        menuPortalTarget={usePortal ? document.body : null}
      />
    </div>
  );
}
