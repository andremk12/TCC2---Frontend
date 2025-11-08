import "./style.css"
import { FileText, ClipboardList, History, User, LogOut, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../../services/api"

function SideMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      const response = await api.get('/login/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
      console.log(response.data)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (
    <>
      <button className={`toggle-button ${!open ? '' : 'collapsed'}`} onClick={() => setOpen(!open)}>
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className={`overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)}></div>

      <aside className={`side-menu ${open ? '' : 'collapsed'}`}>
        <div className="side-header">
          <div className="user-icon">
            <User size={28} color="#ff8c00db" />
          </div>
          <span className="user-name">Olá, {user?.name}</span>
        </div>

        <nav className="side-nav">
          <Link to="/arealojista/precos" className="nav-item">
            <FileText size={20} color="#ff8c00db" />
            <span>Tabela de precos</span>
          </Link>

          <Link to="/arealojista/pedidos" className="nav-item">
            <ClipboardList size={20} color="#ff8c00db" />
            <span>Formulário de pedido</span>
          </Link>

          <Link to="/arealojista/historico" className="nav-item">
            <History size={20} color="#ff8c00db" />
            <span>Histórico de pedidos</span>
          </Link>

          <Link to="/arealojista/edit" className="nav-item">
            <User size={20} color="#ff8c00db" />
            <span>Editar perfil</span>
          </Link>
        </nav>

        <div className="side-footer">
          <a onClick={logout} className="nav-item logout">
            <LogOut size={20} />
            <span>Sair</span>
          </a>

          <a onClick={() => navigate("/arealojista", { state: { openDeletePopup: true } })} className="nav-item delete">
            <Trash2 size={20} />
            <span>Excluir conta</span>
          </a>
        </div>
      </aside>
    </>
  )
}

export default SideMenu
