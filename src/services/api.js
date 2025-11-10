import axios from "axios";

const api = axios.create({
  baseURL: "https://tcc-backend-silvani.onrender.com",
});

api.interceptors.request.use((config) => {
  const isLogin = config.url?.includes("/login"); // rota pública
  const token = localStorage.getItem("token"); // busca token salvo

  if (token && !isLogin) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`; // adiciona Bearer token
  }

  return config;
});

api.interceptors.response.use(
  (resp) => resp, 
  (error) => {
    if (!error?.response) {
      console.warn("Erro sem resposta do servidor:", error);
      return Promise.reject(error);
    }

    // Extrai info de forma segura
    const st = error.response.status;
    const url = error.config?.url || ""; 

    const publicRoutes = [
      "/login",
      "/cadastrar",
      "/registrar",
      "/clientes",
      "/usuarios",
      "/recuperacao",
      "/resetar-senha",
    ];

    const isPublicRoute = publicRoutes.some((r) => url.includes(r));

  
    if ((st === 401 || st === 403) && !isPublicRoute) {
      const msg =
        st === 401
          ? "Sua sessão expirou. Faça login novamente."
          : "Você não tem permissão para acessar esse recurso.";

      sessionStorage.setItem(
        "auth:notice",
        JSON.stringify({ type: "erro", message: msg })
      );

      localStorage.removeItem("token"); // limpa o token
      window.location.replace("/#/login"); // redireciona
    }

    return Promise.reject(error);
  }
);

export default api;
