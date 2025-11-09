import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from "react"
import vendorSchema from "../../../validations/clientSchema"
import { useNavigate } from "react-router-dom"
import { FaUser, FaBuilding, FaIdCard, FaEnvelope, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import './registerForm.css'

function ClientForm({ onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(vendorSchema)
    })

    const [showPswd, setShowPswd] = useState(false)
    const navigate = useNavigate()

    return (
       <form onSubmit={handleSubmit(onSubmit)} class = "form">
            <h1>Cadastro de Lojista</h1>
            <p class ="subtitle-re">Preencha os dados abaixo para criar sua conta</p>

            <div class = "input-group">
                 <FaBuilding class = "icon-re"/>
                <input type="text" placeholder="Insira o nome da Loja" {...register("name")} maxLength={50}/>
            </div>
            <span>{errors.name?.message}</span>

            <div class = "input-group">
                 <FaBuilding class = "icon-re"/>
                <input type="text" placeholder="Razão social" {...register("razaosocial")} maxLength={50}/>
            </div>
            <span class = "error">{errors.razaosocial?.message}</span>

            <div class = "input-group">
                 <FaIdCard class = "icon-re"/>
                 <input type="text" placeholder="CNPJ" {...register("cnpj")} maxLength={14}/>
            </div>
            <span class = "error">{errors.cnpj?.message}</span>

            <div class = "input-group">
                 <FaEnvelope class = "icon-re"/>
                 <input type="text" placeholder="Email" autoComplete="email" {...register("email")} maxLength={100}/>
            </div>
            <span class = "error">{errors.email?.message}</span>

             <div class = "input-group">
                 <FaMapMarkerAlt class = "icon-re"/>
                 <input type="text" placeholder="Endereco" {...register("address")} maxLength={50}/>
            </div>
            <span class = "error">{errors.address?.message}</span>

             <div class = "input-group">
                 <FaLock class = "icon-re"/>
                 <input type={showPswd ? "text" : "password"} placeholder="Senha" autoComplete="new-password" {...register("senha")}/>

                 <button type ="button" 
                 class = "toggle-psswd" 
                 aria-label={showPswd ? "Ocultar senha" : "Mostrar senha"} 
                 onClick={()=> setShowPswd(!showPswd)}>
                        {showPswd ? <FaEyeSlash/> : <FaEye/>}
                 </button>
            </div>
            <span class = "error">{errors.senha?.message}</span>

            <div class = "btn-group">
                <button type ="submit"> Cadastrar</button>
                <button onClick={() => {navigate("/")}}>  Voltar </button>
            </div>

       </form>
    )
}

export default ClientForm