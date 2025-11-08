import React, { useEffect, useState } from "react"
import { FaFileAlt, FaWpforms, FaHistory, FaUserCog, FaSignOutAlt, FaTrash} from 'react-icons/fa'
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import api from "../../services/api"
import Footer from "../../components/footer"
import './style.css'



function AreaDoLojista() {
    const navigate= useNavigate()
    const [popUp, setPopup] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const [error, setError] = useState("")
    const [deleteMsg, setDeleteMsg] = useState("")
    
    const logout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const location = useLocation()

    useEffect(() => {
        if (location.state?.openDeletePopup) {
            setPopup(true)
        }
    }, [location, navigate])


    const handleDelete = async () =>  {
        if (confirmText.toLowerCase() == "confirmar") {
            setError("")
           
            try {
                const response = await api.delete("/clientes_cadastrados/me")
                const msg = response?.data?.mensagem || "Sua conta foi desativada com sucesso"

                 setPopup(false)

                 localStorage.removeItem("token") // Limpa a sessão

                 setDeleteMsg(msg)

                 setConfirmText("")

                 navigate("/")
            } catch (err) {
                const errorMsg = err?.response?.data?.erro || "Não foi possível desativar sua conta."
                const detalhes = err?.response?.data?.detalhes;
                setError(detalhes ? `${errorMsg} (${detalhes})`: errorMsg)
            }


        } else {
            setError("Digite 'confirmar' corretamente para prosseguiir")
        }
    }

    return (
        <div class = "area-lojista">
            <h1>Área do lojista</h1>

            <div class = "grid-cards">
                <div class = "card-container">
                    <div class = "card"  onClick ={() => navigate('/arealojista/precos')}>
                        <FaFileAlt class = "icon"/>
                        <h2>Tabela de preços</h2>
                        <p>Clique aqui para acessar a tabela de preços de todos os nossos produtos e promoções.</p>
                    </div>
                
                    <div class ="card" onClick={() =>navigate('/arealojista/pedidos')}>
                        <FaWpforms class = "icon"/>
                        <h2>Formulário de pedido</h2>
                        <p>Clique aqui para dar inicio ao seu pedido, que será continuado através do WhatsApp.</p>
                    </div>

                    <div class ="card" onClick={() => navigate('/arealojista/historico')}>
                        <FaHistory class = "icon"/>
                        <h2>Histórico de pedidos</h2>
                        <p>Clique aqui para vizualizar seus últimos pedidos feitos.</p>
                    </div>

                    <div class ="card" onClick={()=> navigate("/arealojista/edit")}>     
                        <FaUserCog class = "icon"/>
                        <h2>Editar perfil</h2>
                        <p>Clique aqui para sair da sua conta.</p>
                    </div>

                    <div class="card" onClick={logout}>
                        <FaSignOutAlt class ="icon"/>
                        <h2>Sair</h2>
                        <p>Clique aqui para sair da sua conta.</p>
                    </div>

                    <div class ="card" onClick={() => setPopup(true)}>
                        <FaTrash class = "icon"/>
                        <h2>Excluir conta</h2>
                        <p>Clique aqui para excluir sua conta e apagar todos os seus dados</p>
                    </div>
              </div>
            </div>
            
            {popUp && (
                <div class = "popup-overlay">
                    <div class = "popup">
                        <h2> Confirmar exclusão</h2>
                        <p>Digite <strong>confirmar</strong> para excluir sua conta permanentemente:</p>
                        <input 
                        type="text" 
                        placeholder="Digite 'confirmar'"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        />
                        {error && <p class ="error">{error}</p>}

                        <div class = "popup-btns">
                            {<button class = "cancel" onClick = {() =>{ setPopup(false); setConfirmText("")}}> Cancelar</button>}
                            <button class = "delete" onClick={handleDelete}> Excluir</button>
                        </div>
                    </div>
                </div>
            )}
         <Outlet/>

         {deleteMsg && (
            <div class = "sucesso">
                {deleteMsg}
            </div>
         )}
        </div>

    
    )
}

export default AreaDoLojista