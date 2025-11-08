import './style.css'
import loginSchema from '../../../validations/loginSchema'
import { useForm } from "react-hook-form"
import { useState } from "react"
import { yupResolver } from '@hookform/resolvers/yup'
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from "react-icons/fa";

function LoginForm({ onSubmit }) {
     const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema)
    })

    const [showPasswd, setShowPasswd] = useState(false)
    
    return(
        <form onSubmit={handleSubmit(onSubmit)} class = "newForm">
                <h1 class = "title"> Bem vindo de volta</h1>
                <p class = "subtitle">Entre com seus dados para continuar</p>

                <div class ="inputGroup">
                    <FaUser class = "icon"/>
                    <input placeholder='Email' {...register("user")} />
                </div>
                <span class = "error">{errors.user?.message}</span>

                <div class = "inputGroup">
                    <FaLock class = "icon"/>
                    <input type = {showPasswd ? "text" : "password"} placeholder='Senha' {...register("senha")}/>
                    
                    <button type="button" class = "toggle-passwd" onClick = {() => setShowPasswd(!showPasswd)}> 
                        {showPasswd ? <FaEyeSlash/>: <FaEye/>}
                    </button>
                </div>
                <span class = "error">{errors.senha?.message}</span>

                <a href="/recuperacao" class="forgot">Esqueceu a senha?</a>

                <button type='submit' class="btnPrimary">Entrar</button>

                <p class ="register">
                        Não tem conta? <a href="/cadastrar">Cadastre-se</a>
                </p>

        </form>


    )
}

export default LoginForm

