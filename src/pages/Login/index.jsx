import './style.css'
import LoginForm from "../../components/forms/loginForm/index.jsx" 
import api from "../../services/api.js"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import loginImage from "../../assets/imagemLogin3.jpg"


function Login() {
    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const [type, setType] = useState("sucesso")
    const [show, setShow] = useState(false);
 
    const handleLogin = async (data) => {
        try {
            const retorno = await api.post( '/login',{
                email: data.user,
                senha: data.senha
            })

            localStorage.setItem('token', retorno.data.token)
            setType("sucesso")
            setMessage(retorno.data.mensagem)
            setShow(true)

            setTimeout( () => {
                navigate('/arealojista')
            }, 3000)
        } catch (err) {
            console.log("Erro detalhado:", err)
            if (err.response) {
                setMessage(err.response.data.erro)
                setType('erro')
            } else{
                setMessage("Erro ao conectar com o servidor")
                setType('erro')
            }
            setShow(true)

            setTimeout(() => setShow(false), 3000)
        }
    }

    useEffect(() =>{
        const raw = sessionStorage.getItem('auth:notice')
        if (raw) {
            const { type, message } = JSON.parse(raw)
            setType(type || 'info')
            setMessage(message || '')
            setShow(true)
            sessionStorage.removeItem('auth:notice')
        }
    }, [])

    return(
     <div class = "login-container"> 
        
         <div class = "left-section">
             <LoginForm onSubmit={handleLogin}/>
         </div>
         <div class ="right-section">
             <img src={loginImage} alt="" />
         </div>

            {show && (
                <div class ={`mensagem ${type}`}>  
                        {message}
                </div>
            )}
    
    </div>
        
    )
    
}

export default Login