import axios from "axios";

const api = axios.create({
  // baseURL: "https://tcc-backend-silvani.onrender.com",
  baseURL: "http://localhost:3000",
});


const authFreeRoutes = [
  "/login",
  "/registrar",
  "/recuperacao",
  "/resetar-senha",
  "/cadastrar", 
];

function isRoutePublic(url) {
  return authFreeRoutes.some(
    (r) => url === r || url.startsWith(r + "?")
  );
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url || "";

  const isAuthFree = isRoutePublic(url);

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
      console.warn("Erro sem resposta do servidor:", error);
      return Promise.reject(error);
    }

    const st = error.response.status;
    const url = error.config?.url || "";
    const isPublicRoute = isRoutePublic(url);
    const hasToken = !!localStorage.getItem("token");

    if (st === 401 && !isPublicRoute && hasToken) {
      sessionStorage.setItem(
        "auth:notice",
        JSON.stringify({
          type: "erro",
          message: "Sua sessão expirou. Faça login novamente.",
        })
      );

      localStorage.removeItem("token");
      window.location.replace("#/login");
      return Promise.reject(error);
    }

    if (st === 403 && !isPublicRoute && hasToken) {
      sessionStorage.setItem(
        "auth:notice",
        JSON.stringify({
          type: "erro",
          message: "Você não tem permissão para acessar esse recurso.",
        })
      );
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
