require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

function gerarHashSenha(senha) {
  return bcrypt.hashSync(senha, 10);
}

function criptografarCpf(cpf) {
  const chave = process.env.CRIPTO_CHAVE || "0123456789abcdef0123456789abcdef";
  const iv = process.env.CRIPTO_IV || "0123456789abcdef";
  const cifra = crypto.createCipheriv("aes-256-cbc", chave, iv);
  return cifra.update(cpf, "utf-8", "hex") + cifra.final("hex");
}

console.log("Hash da senha 123456: ", gerarHashSenha("123456"));
console.log("Hash do cpf 11122233344: ", criptografarCpf("11122233344"));
console.log("Hash do cpf 22233344455: ", criptografarCpf("22233344455"));
console.log("Hash do cpf 33344455566: ", criptografarCpf("33344455566"));
