import * as Yup from "yup"

const vendorSchema = Yup.object({
   
    name: Yup.string().required("O nome da loja é obrigatório").min(2,"Deve possuir pelo menos 3 caracteres"),

    cnpj: Yup.string().required("O nome da loja é obrigatório").matches(/^\d{14}$/, "O CNPJ dever ter 14 dígitos"),

    razaosocial: Yup.string().required("A raazão social é orbigatória"),

    email: Yup.string().required("O email é obrigatório").email("Formato de e-mail inválido"),

    address: Yup.string().required("O endereco é obrigatório"),

    senha: Yup.string().required("A senha é obrigatória").min(6, " A senha deve ter no mínimo 6 caracteres")
    .matches(/[A-Z]/, "Deve conter pelo menos uma letra MAIÚSCULA")
    .matches(/[a-z]/, "Deve conter pelo menos uma letra minúsciula")
    .matches(/[0-9]/, "Deve conter pelo menos um número")
    .matches(/[@#!$%*&-_=+.<>{}}]/, "Deve conter pelo menos um caractere especial")


})

export default vendorSchema