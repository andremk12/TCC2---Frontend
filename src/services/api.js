// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://tcc-backend-silvani.onrender.com",
});

const authFreeRoutes = [
  "/login",
  "/registrar",
  "/recuperacao",
  "/resetar-senha",
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url || "";

  const isAuthFree = authFreeRoutes.some((r) => url.startsWith(r));

  if (token && !isAuthFree) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (!error?.response) {
      console.warn("Erro sem resposta do servidor:", error)
      return Promise.reject(error)
    }

    const st = error.response.status;
    const url = error.config?.url || "";

    const publicRoutes = authFreeRoutes;
    const isPublicRoute = publicRoutes.some((r) => url.startsWith(r))

    if ((st === 401 || st === 403) && !isPublicRoute) {
      const msg =
        st === 401
          ? "Sua sessão expirou. Faça login novamente."
          : "Você não tem permissão para acessar esse recurso."

      sessionStorage.setItem(
        "auth:notice",
        JSON.stringify({ type: "erro", message: msg })
      );

      localStorage.removeItem("token");
      window.location.replace("/#/login")
    }

    return Promise.reject(error)
  }
);

export default api
