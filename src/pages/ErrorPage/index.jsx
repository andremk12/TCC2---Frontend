import './style.css'
import e404 from "../../assets/404.png"
import errorA from "../../assets/fofichu.png"
import Footer from '../../components/footer'

function ErrorPage({ code = 404}) {

        const errorData = {
            401: {
                title: "Acesso não autorizado",
                message: "Você precisa fazer login para ver esta página 🔑",
                buttonText: "Ir para o login",
                action: () => (window.location.href = "/login"),
                image: errorA,
            },
            403: {
                title: "Acesso negado",
                message: "Você não tem permissão para acessar esta página 🚷",
                buttonText: "Voltar para o início",
                action: () => (window.location.href = "/"),
                image: errorA,
            },
            404: {
                title: "Oops! Página não encontrada",
                message: "Parece que você se perdeu no caminho 🧭",
                buttonText: "Voltar para o início",
                action: () => (window.location.href = "/"),
                image: e404,
            },
            500: {
                title: "Algo deu errado no servidor",
                message: "Parece que houve um problema do nosso lado 💻",
                buttonText: "Voltar para o início",
                action: () => (window.location.href = "/"),
                image: errorA,
            },
            501: {
                title: "Função não implementada",
                message: "O servidor ainda não sabe lidar com essa requisição 🧩",
                buttonText: "Voltar para o início",
                action: () => (window.location.href = "/"),
                image: errorA,
            },
            502: {
                title: "Erro na comunicação do servidor",
                message: "Recebemos uma resposta inválida de outro servidor 🌐",
                buttonText: "Tentar novamente",
                action: () => window.location.reload(),
                image: errorA,
            },
            503: {
                title: "Serviço temporariamente indisponível",
                message: "Estamos em manutenção ou o servidor está sobrecarregado 🛠",
                buttonText: "Voltar para o início",
                action: () => (window.location.href = "/"),
                image: errorA,
            }
        }

        const error = errorData[code] || errorData[404]
    return (
    <>
      <div class = "err-container">
        <div class ="err-card">
             <img src = {error.image} alt={`Erro${code}`} class = "err-image"/>
             <h1 class = "err-title">{error.title}</h1>
             <p class = "err-message">{error.message}</p>
             <button class = "err-button" onClick={error.action}>
                        {error.buttonText}
             </button>
        </div>
      </div>

    <Footer/>
    </>
    )
}

export default ErrorPage