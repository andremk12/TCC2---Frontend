import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api"; // importa tua instância Axios

export default function PrivateRoute({ children }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const resp = await api.get("/login/me")

        const status = resp?.data?.status?.toLowerCase?.();

        if (status === "ativo") {
          setAllowed(true)
        } else {
           localStorage.removeItem("token")
           setAllowed(false)
        }

      } catch (e) {
        console.error("Erro ao verificar usuário:", e)
        localStorage.removeItem("token")
        setAllowed(false)
      } finally {
        setLoading(false)
      }
    };

    verificarUsuario();
  }, []);

  if (loading) {
    return <div>Verificando acesso...</div>; 
  }

  return allowed ? children : <Navigate to="/login" replace />;
}
