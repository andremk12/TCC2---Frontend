import "./style.css"
import { useState } from "react"
import api from "../../services/api"

function Recovery() {

    const [email, setEmail] = useState("")
    const [menssage, setMessage] =  useState("")
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setErro("")
        setCarregando(true)

        try {
            const response = await api.post("/password/esqueci-senha", { email })
            setMessage(response.data.mensagem)
            setEmail("")
        } catch (error) {
            if (error.response?.data?.erro) {
                setErro(error.response.data.erro)
            } else {
                setErro("Erro desconhecido")
            }
        } finally {
            setCarregando(false)
        }
    }
    
    return (
        <div class = "recovery-container">
            <h2> Recuperar Senha</h2>

            <p class = "recovery-subtiitle">
                Digite seu e-mail cadastrado para receber o link de redefinição.
            </p>

            <form onSubmit={handleSubmit} class = "recovery-form">
                   <label htmlFor="email">Digite seu e-mail:</label>
                   <input type="email"
                          id = "email"
                          placeholder="email@exemplo.com"
                          value = {email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                   /> 
                   <button type="submit">
                        {carregando ? "Enviando..." : "Enviar link de recuperação"} 
                    </button>
            </form>

            {menssage && <p class = "sucesso">{menssage}</p>}
            {erro && <p class = "erro">{erro}</p>}
        </div>
    )
}

export default Recovery