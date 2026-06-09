# 📚 Guia de Estudo — Fetch API + Integração Back-End

**SENAI Ítalo Bologna — Técnico em Desenvolvimento de Sistemas — Programação Front-End**

> Baseado nos slides da Aula 9, nos arquivos do projeto TechFood (Aulas 8–10) e no enunciado da Atividade de Cadastro.

---

## Índice

1. [Por que sair do localStorage?](#1-por-que-sair-do-localstorage)
2. [O que é a Fetch API?](#2-o-que-é-a-fetch-api)
3. [O problema: fetch é assíncrono](#3-o-problema-fetch-é-assíncrono)
4. [async / await — a forma moderna](#4-async--await--a-forma-moderna)
5. [Tratamento de erros com try/catch](#5-tratamento-de-erros-com-trycatch)
6. [CORS — o inimigo invisível](#6-cors--o-inimigo-invisível)
7. [sessionStorage vs localStorage](#7-sessionstorage-vs-localstorage)
8. [api.js — centralizando o fetch](#8-apijs--centralizando-o-fetch)
9. [Métodos HTTP na prática (GET, POST, PATCH, DELETE)](#9-métodos-http-na-prática)
10. [Conceito de Mesa (TechFood)](#10-conceito-de-mesa-techfood)
11. [Fluxo completo do TechFood](#11-fluxo-completo-do-techfood)
12. [Aula 10 — Cadastro de Pratos](#12-aula-10--cadastro-de-pratos)
13. [Checklist para a prova](#13-checklist-para-a-prova)
14. [Erros comuns e como resolver](#14-erros-comuns-e-como-resolver)

---

## 1. Por que sair do localStorage?

O `localStorage` guarda dados **só no navegador daquele computador**. Abrir o cardápio em outro dispositivo — os pedidos não aparecem.

|                                 | localStorage         | Servidor                 |
| ------------------------------- | -------------------- | ------------------------ |
| Onde vive                       | Navegador do cliente | Banco de dados remoto    |
| Visível em outros dispositivos? | ❌ Não               | ✅ Sim                   |
| Perdido ao limpar o navegador?  | ✅ Sim               | ❌ Não                   |
| Ideal para                      | Carrinho temporário  | Pedidos reais da cozinha |

> **Analogia do slide:** o localStorage é um bloco de notas no seu bolso. O servidor é o sistema do restaurante — qualquer garçom, em qualquer terminal, vê o mesmo pedido.

---

## 2. O que é a Fetch API?

A **Fetch API** é uma interface **nativa do navegador** para fazer requisições HTTP — o JavaScript conversa com o servidor sem precisar de biblioteca externa.

```js
fetch("http://localhost:3000/produtos"); // uma linha — o navegador busca os dados
```

### Métodos HTTP

| Método   | O que faz             | Exemplo no TechFood          |
| -------- | --------------------- | ---------------------------- |
| `GET`    | Busca dados           | Listar pratos do cardápio    |
| `POST`   | Cria novo dado        | Enviar pedido para a cozinha |
| `PATCH`  | Atualiza parcialmente | Mudar status do pedido       |
| `DELETE` | Remove                | Cancelar um pedido           |

> **PUT vs PATCH:** PUT substitui o recurso inteiro. PATCH atualiza só um campo. Para mudar o status de um pedido, PATCH é a escolha certa.

---

## 3. O problema: fetch é assíncrono

O JavaScript **não para** esperando o servidor responder — ele continua rodando. Isso se chama **operação assíncrona**.

```js
// ❌ Errado — o log roda ANTES dos dados chegarem
const dados = fetch("http://localhost:3000/produtos");
console.log(dados); // Promise { pending } — ainda não chegou!
```

O `fetch()` retorna sempre uma **Promise** — um objeto que representa uma operação que ainda vai terminar.

### Solução antiga: `.then()` encadeado

```js
fetch("http://localhost:3000/produtos")
  .then((res) => res.json()) // converte a resposta em objeto JS
  .then((dados) => console.log(dados)); // agora sim, dados reais
```

> Você vai ver `.then()` em código legado — saiba reconhecer, mas prefira `async/await` nos novos arquivos.

---

## 4. async / await — a forma moderna

`async/await` é açúcar sintático sobre Promises — o código fica mais legível e fácil de depurar.

```js
async function buscarProdutos() {
  const res = await fetch("http://localhost:3000/produtos");
  const dados = await res.json();
  console.log(dados); // dados reais!
}
buscarProdutos();
```

### Regras obrigatórias

- `async` → transforma a função em assíncrona. **Só dentro de função `async` você pode usar `await`.**
- `await` → pausa **a função** e espera a Promise resolver. A **página não trava** — só aquela função espera.
- Sem `async`, o `await` dá erro de sintaxe.

---

## 5. Tratamento de erros com try/catch

Qualquer coisa pode dar errado: servidor offline, sem internet, rota inexistente. Sem `try/catch`, o erro quebra a página silenciosamente.

```js
async function buscarProdutos() {
  try {
    const response = await fetch("http://localhost:3000/produtos");
    const dados = await response.json(); // ← lê o JSON PRIMEIRO
    if (!response.ok)
      // ← verifica DEPOIS
      throw new Error(dados.erro || `Erro ${response.status}`);
    return dados;
  } catch (erro) {
    console.error("Falha:", erro.message);
  }
}
```

### ⚠️ Atenção crítica

> `fetch` **não lança erro** em respostas `404` ou `500` — ele só lança em **falha de rede** (servidor completamente offline). Por isso verificamos `response.ok` manualmente.

| Situação               | `catch` captura? | `response.ok` é false? |
| ---------------------- | ---------------- | ---------------------- |
| Servidor offline       | ✅ Sim           | —                      |
| Rota inexistente (404) | ❌ Não           | ✅ Sim                 |
| Erro interno (500)     | ❌ Não           | ✅ Sim                 |
| Sucesso (200–299)      | ❌ Não           | ❌ (é `true`)          |

### Por que ler o JSON antes de verificar `response.ok`?

Porque o servidor pode enviar `dados.erro` com uma mensagem explicativa mesmo em respostas de erro. Se você verificar `response.ok` primeiro e der `throw`, perde essa mensagem. Então: **JSON primeiro, verificação depois**.

---

## 6. CORS — o inimigo invisível

Ao fazer o primeiro fetch, você provavelmente vai ver:

```
Access to fetch at 'http://localhost:3000' from origin
'http://127.0.0.1:5500' has been blocked by CORS policy
```

**CORS** (Cross-Origin Resource Sharing) bloqueia requisições entre origens diferentes por segurança. Front em `localhost:5500`, back em `localhost:3000` — origens diferentes para o navegador.

### Solução — no servidor (nunca no front-end)

```js
const cors = require("cors");
app.use(cors()); // no app.js do back-end
```

> **Regra de ouro:** CORS é resolvido no **servidor**, não no front. O navegador bloqueia, o servidor libera. O front-end não tem como contornar CORS sozinho.

---

## 7. sessionStorage vs localStorage

Para guardar o nome do cliente durante a visita:

```js
sessionStorage.setItem("techfood_cliente", "João");
const cliente = sessionStorage.getItem("techfood_cliente");
```

|                             | `localStorage`                     | `sessionStorage`                                          |
| --------------------------- | ---------------------------------- | --------------------------------------------------------- |
| **Dura até**                | Usuário limpar manualmente         | Fechar a aba                                              |
| **Uso no TechFood**         | Carrinho (`techfood_pedidos`)      | Nome do cliente, total da mesa, histórico                 |
| **Por que essa separação?** | O carrinho pode sobreviver a um F5 | O próximo cliente na mesa não deve ver o nome do anterior |

### Chaves usadas no TechFood

```
localStorage["techfood_pedidos"]         → carrinho (não enviado ainda)
sessionStorage["techfood_cliente"]       → nome do cliente da sessão
sessionStorage["techfood_total_mesa"]    → conta acumulada da mesa
sessionStorage["techfood_historico"]     → itens já enviados à cozinha
```

---

## 8. api.js — centralizando o fetch

Em vez de espalhar `fetch` por todos os arquivos, o projeto centraliza tudo em `api.js`. Se a URL do servidor mudar, altera-se só `BASE_URL` — o resto do projeto não muda.

```js
const BASE_URL = "http://localhost:3000";
```

### Padrão de cada função

Toda função do `api.js` segue o mesmo padrão de 4 linhas:

```js
async function nomeDaFuncao(parametros) {
  const response = await fetch(`${BASE_URL}/rota`, {
    /* opções */
  });
  const dados = await response.json(); // JSON primeiro
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}
```

> **Por que cada função trata sua própria resposta?** Algumas rotas do back-end envelopam a resposta em `{ sucesso, dados, total }` (como `/produtos`) e outras retornam o objeto puro (como `/pedidos`). Não dá para ter uma função genérica.

---

## 9. Métodos HTTP na prática

### GET — buscarProdutos()

```js
async function buscarProdutos() {
  const response = await fetch(`${BASE_URL}/produtos`);
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados.dados; // extrai o array de dentro do envelope { sucesso, dados, total }
}
```

### POST — criarPedido(cliente, itens)

```js
async function criarPedido(cliente, itens) {
  const response = await fetch(`${BASE_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // avisa que o body é JSON
    body: JSON.stringify({ cliente, itens }), // objeto → string
  });
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}
```

**Pontos importantes do POST:**

- `Content-Type: application/json` → sem isso o servidor não consegue ler o body
- `JSON.stringify()` → converte o objeto JS em texto JSON para enviar
- O back-end exige `produto_id` e `quantidade` — **nunca o nome nem o preço**. Preço vem do banco (segurança).

### PATCH — atualizarStatusPedido(id, novoStatus)

```js
async function atualizarStatusPedido(id, novoStatus) {
  const response = await fetch(`${BASE_URL}/pedidos/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }), // só o campo que muda
  });
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}
```

**Fluxo de status:** `pendente` → `preparo` → `pronto` → `entregue`

### DELETE — deletarPedido(id)

```js
async function deletarPedido(id) {
  const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
    method: "DELETE",
  });
  const dados = await response.json();
  if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
  return dados;
}
```

---

## 10. Conceito de Mesa (TechFood)

O sistema simula um tablet numa mesa de restaurante. A ideia central:

```
localStorage["techfood_pedidos"]      → carrinho atual (pode ser limpo sem perder a conta)
sessionStorage["techfood_total_mesa"] → somatório de tudo que já foi enviado à cozinha
sessionStorage["techfood_historico"]  → lista de itens para o painel "Conta da Mesa"
```

### Como os totais funcionam

```
#valor-total-resumo (topo)  = só o carrinho atual — zera ao enviar ou limpar
#valor-total (rodapé)       = totalMesa + totalCarrinho — NUNCA zera ao "Limpar Pedidos"
```

### O que "Limpar Pedidos" faz vs o que "Fechar Conta" faz

| Ação                 | localStorage       | sessionStorage                             |
| -------------------- | ------------------ | ------------------------------------------ |
| Limpar Pedidos       | ✅ Remove carrinho | ❌ Não toca                                |
| Fechar Conta da Mesa | ✅ Remove carrinho | ✅ Remove tudo (cliente, total, histórico) |

### Por que dois passos (localStorage → API)?

O cliente monta o pedido no cardápio (localStorage). Só ao clicar **"Enviar para Cozinha"** o pedido vai ao banco. Isso separa a montagem do envio — se o servidor estiver offline, o carrinho não é perdido.

---

## 11. Fluxo completo do TechFood

```
1. Cliente abre index.html
       ↓
2. global.js verifica sessionStorage["techfood_cliente"]
       ↓ não existe
3. Modal de boas-vindas aparece → cliente digita o nome
       ↓ confirma
4. Nome salvo no sessionStorage → saudação personalizada no header
       ↓
5. main.js chama renderizarCardapio()
       ↓
6. api.js: GET /produtos → servidor retorna array de pratos
       ↓
7. Cards criados dinamicamente com createElement (data-id com ID do banco)
       ↓
8. Cliente clica "Pedir Agora" → salvarPedido() guarda no localStorage
       ↓
9. Cliente vai para pedidos.html → renderizarPedidos() lê localStorage
       ↓
10. Cliente clica "Enviar para Cozinha"
        ↓
11. api.js: POST /pedidos → servidor insere no banco
        ↓ sucesso
12. sessionStorage["techfood_total_mesa"] acumula o valor
    sessionStorage["techfood_historico"] acumula os itens
    localStorage["techfood_pedidos"] é limpo
        ↓
13. Cliente pode "Ver Conta da Mesa" → renderizarContaMesa() lê historico
        ↓
14. "Fechar Conta da Mesa" → modal de confirmação → limpa tudo → volta ao cardápio
```

---

## 12. Aula 10 — Cadastro de Pratos

### O que foi pedido

Criar `cadastro.html`, `cadastro.js` e `cadastro.css` integrando com `POST /produtos` via `cadastrarProduto()` no `api.js`.

### Estratégias de imagem (slide mencionou três)

| Estratégia                        | Como funciona                                                      | Complexidade                              |
| --------------------------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| **URL externa** ✅ (implementada) | Admin cola URL de imagem já hospedada. Back-end salva só a string. | Baixa — sem upload                        |
| **Upload de arquivo**             | `<input type="file">` + `FormData` + `multer` no back-end          | Alta — precisa salvar arquivo no servidor |
| **Base64**                        | Converte imagem em string com `FileReader` e salva no banco        | Média — banco fica pesado                 |

### Por que URL externa foi escolhida para esta aula

- Não exige `FormData` nem `multer`
- O `POST /produtos` continua enviando JSON puro
- A imagem é só mais um campo string no objeto

### Função adicionada ao api.js

```js
async function cadastrarProduto(dados) {
  // dados = { nome, descricao, preco, categoria, imagem }
  const response = await fetch(`${BASE_URL}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  const resposta = await response.json();
  if (!response.ok) throw new Error(resposta.erro || `Erro ${response.status}`);
  return resposta;
}
```

### Por que validar no front se o back-end também valida?

- **Front-end:** feedback imediato — o usuário não espera o servidor para saber que esqueceu de preencher o preço
- **Back-end:** barreira de segurança — nunca confia no front
- As **duas camadas** precisam existir

---

## 13. Checklist para a prova

### Conceitos teóricos

- [ ] O que é a Fetch API e por que ela existe
- [ ] Diferença entre operação síncrona e assíncrona
- [ ] O que é uma Promise e por que `fetch()` retorna uma
- [ ] O que `async` faz numa função
- [ ] O que `await` faz e por que só funciona dentro de `async`
- [ ] Por que `fetch` não lança erro em 404/500 (só em falha de rede)
- [ ] Por que ler `.json()` antes de verificar `response.ok`
- [ ] O que é CORS e onde ele é resolvido (servidor, não front)
- [ ] Diferença entre `localStorage` e `sessionStorage`
- [ ] Diferença entre `PUT` e `PATCH`
- [ ] Diferença entre `POST` e `PUT`

### Código

- [ ] Escrever uma função `async` com `fetch` GET do zero
- [ ] Escrever um `fetch` POST com `Content-Type` e `JSON.stringify`
- [ ] Adicionar `try/catch` corretamente com verificação de `response.ok`
- [ ] Identificar o que está errado num código sem `async/await`
- [ ] Saber o que `JSON.stringify` e `JSON.parse` fazem

### TechFood específico

- [ ] Saber o que cada chave do storage guarda
- [ ] Explicar por que `produto_id` e não o nome é enviado ao servidor
- [ ] Explicar o fluxo: cardápio → localStorage → "Enviar para Cozinha" → banco
- [ ] Diferença entre "Limpar Pedidos" e "Fechar Conta da Mesa"
- [ ] Por que os cards têm `data-id` no HTML

---

## 14. Erros comuns e como resolver

### "Promise { pending }" no console

**Causa:** usar `fetch` sem `await`
**Solução:** declarar a função como `async` e usar `await` antes do `fetch`

### "CORS policy blocked"

**Causa:** front em porta diferente do back (5500 ≠ 3000)
**Solução:** adicionar `app.use(cors())` no `app.js` do servidor. **Não tem como resolver no front.**

### O erro 404/500 não cai no `catch`

**Causa:** `fetch` só lança no `catch` em falha de rede
**Solução:** verificar `response.ok` após ler o JSON e lançar o erro manualmente com `throw new Error(...)`

### `Cannot use import statement` / `await is only valid in async functions`

**Causa:** `await` fora de função `async`
**Solução:** adicionar `async` na declaração da função que contém o `await`

### O preço muda na tela mas não é enviado ao servidor

**Causa:** o front exibe o preço calculado (quantidade × unitário) mas `criarPedido` só manda `produto_id` e `quantidade`
**Solução:** correto por design — o servidor busca o preço no banco para evitar manipulação

### "Erro ao carregar o cardápio" na tela

**Causa:** o servidor Node.js não está rodando
**Solução:** rodar `node app.js` (ou `npm start`) no terminal antes de abrir o front

---

## Resumo rápido (para revisar 5 minutos antes da prova)

```
Fetch API     = interface nativa do navegador para requisições HTTP
GET           = buscar  |  POST = criar  |  PATCH = atualizar parte  |  DELETE = remover
async/await   = forma moderna de esperar Promise sem travar a página
try/catch     = captura erros — mas 404/500 NÃO caem no catch automaticamente
response.ok   = true se status 200–299, false caso contrário
JSON antes ok = ler .json() ANTES de checar response.ok (pega mensagem de erro do servidor)
CORS          = resolvido no SERVIDOR com cors() — front não resolve
sessionStorage= some ao fechar a aba — ideal para sessão de mesa
localStorage  = persiste até limpar — ideal para carrinho temporário
api.js        = um fetch por função, BASE_URL centralizada
produto_id    = back-end exige o ID — nunca confia em nome/preço do front
```

---

_SENAI Ítalo Bologna — Itu/SP — 2026_
