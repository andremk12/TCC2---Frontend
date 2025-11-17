import { useState } from 'react'
import './style.css'
import InputMask from 'react-input-mask'
import api from '../../services/api'
import React from 'react'
import ClientForm from '../../components/forms/registerForm/registerForm'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../../components/footer'


function Register() {
  const navigate = useNavigate()
  const [sucess, setSuccess] = useState("")
  const [type, setType] = useState("sucesso")
  const [shMsg, setShMsg] = useState(false)

async function createUsers(data){
  try {
    await api.post('/clientes_cadastrados', data)
    setSuccess("Cadastro realizado com sucesso! Redirecionaremos você para login")
    setType("Sucesso")
    setShMsg(true)


    setTimeout(() => {
      navigate('/login')
    }, 3000)

  } catch (err) {
    console.error("Erro no POST:", err.response?.data || err.message)
    setSuccess("Erro no cadastro. Tente novamente")
    setType('erro')
    setShMsg(true)
  }
}
    
  return (
      <>
       <div class = 'container'>
            <ClientForm onSubmit={createUsers}/>
        <div>

        {shMsg && (
         <div class ={`sucesso ${type}`}>
            <p>{sucess}</p>
         </div>
        )}
      </div>
        <span class = "log"> Ja possui cadastro? <Link to="/login">Clique aqui</Link></span>
       </div>

       <Footer/>
    </>
  )
}

export default Register
