import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

const ADMIN_ID = String(import.meta.env.VITE_ADMIN_USER_ID || "");

function decodeJwtId(token) {
  try {
    const base64 = token.split(".")[1];
    const json = JSON.parse(atob(base64));
    return json?.id ? String(json.id) : null; // payload: { id, email, ... }
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [authError, setAuthError] = useState(false); // 401

  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthError(true);
          return;
        }

        // 1) Tentativa rápida: decodifica o JWT localmente
        const idFromToken = decodeJwtId(token);
        if (idFromToken && String(idFromToken) === ADMIN_ID) {
          setAllowed(true);
          return;
        }

        // 2) Fallback confiável: consulta /login/me
        const me = await api.get("/login/me"); // headers via interceptor
        const idFromMe = me?.data?.id ? String(me.data.id) : "";
        setAllowed(idFromMe === ADMIN_ID);
      } catch (e) {
        const st = e?.response?.status;
        if (st === 401) setAuthError(true);
        else setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        Verificando acesso de administrador…
      </p>
    );
  }

  if (authError) return <Navigate to="/erro/401" replace />;
  if (!allowed) return <Navigate to="/erro/403" replace />;
  return children;
}
