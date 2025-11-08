import editSchema from "../../../validations/editSchema"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from "react"
import "./style.css"

function EditForm({ onSubmit, defaultValues }){
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm({
        resolver: yupResolver(editSchema),
    })

      useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);
  
   return(
     <form onSubmit={handleSubmit(onSubmit)} class="form-e">
            <h1>Editar perfil</h1>

            <div class="form-e-group">
                <p>Nome de sua loja</p>
                <input placeholder="Insira o nome da loja" {...register("name")}/>
                <span>{errors.name?.message}</span>
            </div>

            <div class="form-e-group">
                <p>CNPJ</p>
                <input placeholder="CNPJ" {...register("cnpj")}/>
                <span>{errors.cnpj?.message}</span>
            </div>

            <div class="form-e-group">
                <p>Razão Social</p>
                <input placeholder="Razão social" {...register("razaosocial")}/>
                <span>{errors.razaosocial?.message}</span>
            </div>

            <div class="form-e-group">
                <p>Email</p>
                <input placeholder="Email" {...register("email")}/>
                <span>{errors.email?.message}</span>
            </div>
            
            <div class="form-e-group">
                <p>Endereço</p>
                <input placeholder="Endereço da loja" {...register("address")}/>
                <span>{errors.address?.message}</span>
            </div>

            <div class="form-e-group">
                <p>Senha</p>
                <input placeholder="Deixe vazio para manter a senha atual" type = "password" {...register("senha")}/>
                <span>{errors.senha?.message}</span>
            </div>

            <div class ="button-e-group">
                <button type ="submit">Salvar alterações</button>
                <button type = "button" onClick = {() => {window.location.href = "/arealojista"}}> Voltar </button>
            </div>
            
     </form>
   )

}

export default EditForm