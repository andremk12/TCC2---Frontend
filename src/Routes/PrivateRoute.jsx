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
        const resp = await api.get("/login/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const status = resp?.data?.status?.toLowerCase?.();
        setAllowed(status === "ativo");
      } catch (e) {
        console.error("Erro ao verificar usuário:", e);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    verificarUsuario();
  }, []);

  if (loading) {
    return <div>Verificando acesso...</div>; // opcional: pode trocar por um spinner
  }

  return allowed ? children : <Navigate to="/login" replace />;
}
