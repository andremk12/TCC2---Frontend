import "./style.css"
import { CheckCircle } from "lucide-react"

function OrderPup({isOpen, onClose, id}) {
    
    if (!isOpen) return null

    return (
            <div class = "p-overlay">
                <div class = "p-box">
                   <CheckCircle size = {60} class = "p-icon"/>
                   <h2>Pedido Realizado!</h2>
                   <p> Seu pedido foi registrado com sucesso.</p>
                
                    {id && (
                        <p class = "p-id">
                            Número do pedido: <strong>{id}</strong>
                        </p>
                    )}

                    <button class = "p-btn" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
    )
}   

export default OrderPup