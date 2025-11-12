import './style.css'
import LoginForm from "../../components/forms/loginForm/index.jsx" 
import api from "../../services/api.js"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import loginImage from "../../assets/imagemLogin3.jpg"

function Login() {
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [type, setType] = useState("sucesso")
  const [show, setShow] = useState(false)

  const handleLogin = async (data) => {
    try {
      const retorno = await api.post('/login', {
        email: data.user,
        senha: data.senha
      })

      const token = retorno.data?.token
      localStorage.setItem('token', token)

   
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

  
      setType('sucesso')
      setMessage(retorno.data?.mensagem || 'Login realizado!')
      setShow(true)

   
      setTimeout(() => {
        setShow(false)
        navigate('/arealojista', { replace: true }) 
      }, 1200)

    } catch (err) {
      console.log("Erro detalhado:", err)
      setType('erro')
      setMessage(err?.response?.data?.erro || 'Erro ao conectar com o servidor')
      setShow(true)
      setTimeout(() => setShow(false), 3000)
    }
  }

  return (
    <div class="login-container">
      <div class="left-section">
        <LoginForm onSubmit={handleLogin} />
      </div>
      <div class="right-section">
        <img src={loginImage} alt="Tela de login" />
      </div>

      {show && (
        <div className={`mensagem ${type}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Login
