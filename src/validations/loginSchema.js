import * as Yup from 'yup'

const loginSchema = Yup.object({
    user: Yup.string().test(
        "is-email-or-name",
        "Digite um e-mail ou usuário válido",
        value => {
            if (!value) return false
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                const isName = /^[A-Za-zÀ-ÿ\s]+$/.test(value)
                return isEmail || isName;
        }
    ),
    senha: Yup.string().required("Insira uma senha")

})

export default loginSchema