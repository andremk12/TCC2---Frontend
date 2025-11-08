import * as Yup from "yup"

const editSchema = Yup.object({
   
    name: Yup.string().required("O nome da loja é obrigatório").min(2,"Deve possuir pelo menos 3 caracteres"),

    cnpj: Yup.string().required("O nome da loja é obrigatório").matches(/^\d{14}$/, "O CNPJ dever ter 14 dígitos"),

    razaosocial: Yup.string().required("A raazão social é orbigatória"),

    email: Yup.string().required("O email é obrigatório").email("Formato de e-mail inválido"),

    address: Yup.string().required("O endereco é obrigatório"),

senha: Yup.string()
  .notRequired()
  .nullable()
  .test(
    "senha-valida",
    "A senha deve ter no mínimo 6 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial",
    (value) => {
      if (!value) return true; // se estiver vazio, não valida
      return (
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[@#!$%*&\-_=+.<>{}]/.test(value) &&
        value.length >= 6
      );
    }
  )
})

export default editSchema