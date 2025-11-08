import "./style.css"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import * as Yup from "yup"


const senhaSchema = Yup.object({
  novaSenha: Yup.string()
    .required("A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .matches(/[A-Z]/, "Deve conter pelo menos uma letra MAIÚSCULA")
    .matches(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .matches(/[0-9]/, "Deve conter pelo menos um número")
    .matches(/[@#!$%*&\-_=+.<>{}}]/, "Deve conter pelo menos um caractere especial"),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref("novaSenha"), null], "As senhas não coincidem")
    .required("A confirmação da senha é obrigatória"),
})

function Reset() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [novaSenha, setNovasenha] = useState("")
  const [confirmarSenha, setConrimarSenha] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [showPasswd, setShowPasswd] = useState(false)
  const [showPasswd2, setShowPasswd2] = useState(false)
  const [errors, setErrors] = useState({}) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem("")
    setErro("")
    setErrors({})

    try {
      await senhaSchema.validate({ novaSenha, confirmarSenha }, { abortEarly: false })

      setCarregando(true)
      const response = await api.post(`/password/resetar-senha/${token}`, { novaSenha })
      setMensagem(response.data.mensagem)
      setTimeout(() => navigate("/login"), 2000)
    } catch (error) {
      if (error.name === "ValidationError") {
        // Mapeia os erros do Yup para o estado
        const validationErrors = {}
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)
      } else if (error.response?.data?.erro) {
        setErro(error.response.data.erro)
      } else {
        setErro("Erro de conexão com o servidor")
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="reset-container">
      <h2>Redefinir senha</h2>

      {erro.includes("Token inválido") ? (
        <div className="error-token">
          <button className="btn-retry" onClick={() => navigate("/recuperacao")}>
            Solicitar novo link
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="reset-form">
          <label htmlFor="novaSenha">Nova senha:</label>
          <div className="input-wrapper">
            <input
              type={showPasswd ? "text" : "password"}
              id="novaSenha"
              placeholder="Nova Senha"
              value={novaSenha}
              onChange={(e) => setNovasenha(e.target.value)}
            />
            <button
              type="button"
              className="toggle-passwd-rt"
              onClick={() => setShowPasswd(!showPasswd)}
            >
              {showPasswd ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.novaSenha && <p className="input-error">{errors.novaSenha}</p>}

          <label htmlFor="confirmarSenha">Confirmar nova senha:</label>
          <div className="input-wrapper">
            <input
              type={showPasswd2 ? "text" : "password"}
              id="confirmarSenha"
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConrimarSenha(e.target.value)}
            />
            <button
              type="button"
              className="toggle-passwd-rt"
              onClick={() => setShowPasswd2(!showPasswd2)}
            >
              {showPasswd2 ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmarSenha && <p className="input-error">{errors.confirmarSenha}</p>}

          <button type="submit" className="btn-submit">
            {carregando ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>
      )}

      {mensagem && <p className="mensagem">{mensagem}</p>}
      {erro && <p className="erro">{erro}</p>}
    </div>
  )
}

export default Reset
