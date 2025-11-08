import api from "../../services/api";
import './style.css'
import EditForm from "../../components/forms/editForm";
import {useState, useEffect} from 'react'

function EditScreen() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("")
  const [type, setType] = useState("sucesso")
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      const response = await api.get("/login/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data)
    };
    fetchUser();
  }, []);

useEffect(() => {
  if (showMessage) {
    const timer = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(timer);
  }
}, [showMessage]);

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/login/me", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Perfil atualizado com sucesso!");
      setType("sucesso")
      setShowMessage(true)
      console.log(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.erro || "Erro ao atualizar perfil");
      setShowMessage(true)
      setType("erro")
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
   <>
    <EditForm
      onSubmit={handleSubmit}
      defaultValues={{ ...user, senha: "" }} 
    />

      {showMessage && (
        <div class = {`mensagem ${type}`}>
          {message}
        </div>
      )
    }
  </>
  );
}

export default EditScreen;
