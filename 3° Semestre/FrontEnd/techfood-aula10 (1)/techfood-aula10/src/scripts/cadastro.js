/* ==========================================================
   CADASTRO.JS — Tela de Cadastro de Pratos (cadastro.html)  NEW

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 10 — inicializarCadastro(): configura todos os listeners
                 do formulário em um único ponto de entrada.
                 validarFormulario(): valida os campos antes de enviar —
                 nome obrigatório, preço positivo, categoria selecionada.
                 configurarPreviewImagem(): atualiza a prévia em tempo real
                 conforme o usuário digita a URL da imagem.
                 configurarContadorDescricao(): contador de caracteres ao vivo.
                 salvarNovoPrato(): chama cadastrarProduto() (api.js) via
                 POST /produtos e exibe feedback de sucesso ou erro.
                 adicionarPratoNaListaRecentes(): registra o prato recém-
                 cadastrado em uma lista visual na própria página.
   [ ] Futuro  — Estratégia de upload de arquivo (FormData + multipart):
                 substituir o campo URL por <input type="file">, ler o
                 arquivo com FileReader e enviar via FormData ao servidor.
                 O back-end precisaria de multer (Node.js) para receber o
                 arquivo e salvar na pasta src/images/.
                 Autenticação de admin: verificar localStorage["techfood_admin"]
                 antes de exibir o formulário — redirecionar se não autenticado.

   Carregado DEPOIS de global.js e api.js em cadastro.html.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  inicializarCadastro();
});

// ─────────────────────────────────────────────────────────────────────────────
// inicializarCadastro()
// Ponto de entrada: registra todos os listeners da tela de cadastro.
// Separar "registrar listeners" de "lógica de negócio" facilita a manutenção
// — cada função abaixo faz exatamente uma coisa.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarCadastro() {
  const form         = document.querySelector("#form-cadastro");
  const btnLimpar    = document.querySelector("#btn-limpar-form");
  const inputImagem  = document.querySelector("#input-imagem");
  const inputDesc    = document.querySelector("#input-descricao");

  if (!form) return;

  // Submit do formulário — valida e envia ao back-end
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // impede o reload padrão do navegador
    salvarNovoPrato();
  });

  // Botão Limpar — zera todos os campos sem precisar recarregar
  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparFormulario);
  }

  // Preview de imagem em tempo real — atualiza a cada tecla
  if (inputImagem) {
    inputImagem.addEventListener("input", configurarPreviewImagem);
  }

  // Contador de caracteres da descrição — atualiza ao vivo
  if (inputDesc) {
    inputDesc.addEventListener("input", configurarContadorDescricao);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// configurarContadorDescricao()
// Exibe quantos caracteres foram digitados no campo descrição.
// O max é 200 (definido no HTML pelo maxlength) — o contador fica vermelho
// ao atingir o limite, sinalizando visualmente que não há mais espaço.
// ─────────────────────────────────────────────────────────────────────────────
function configurarContadorDescricao() {
  const inputDesc  = document.querySelector("#input-descricao");
  const contador   = document.querySelector("#contador-descricao");
  if (!inputDesc || !contador) return;

  const atual = inputDesc.value.length;
  const maximo = 200;
  contador.textContent = `${atual} / ${maximo}`;
  contador.style.color = atual >= maximo ? "#e74c3c" : "#aaa";
}

// ─────────────────────────────────────────────────────────────────────────────
// configurarPreviewImagem()
// Estratégia de imagem escolhida: URL externa.
//
// Como funciona:
//   1. O admin cola a URL de uma imagem já hospedada na internet.
//   2. Esta função cria um objeto Image temporário para testar se a URL
//      carrega com sucesso antes de exibir o preview.
//   3. Se a URL for válida (onload), exibe a prévia abaixo do campo.
//   4. Se a URL for inválida (onerror), oculta o preview e mostra erro.
//
// Por que não <input type="file">?
//   Upload de arquivo requer FormData, um servidor com multer (Node.js)
//   para receber o binário, e uma pasta para salvar — complexidade além
//   do escopo desta aula. URL externa é só uma string no JSON, funciona
//   com o mesmo POST /produtos já implementado.
//
// Limitação conhecida: a URL precisa ser acessível publicamente.
//   Imagens de outras abas abertas no navegador (blob: / data:) não funcionam
//   quando salvas no banco — apenas URLs https:// são recomendadas.
// ─────────────────────────────────────────────────────────────────────────────
function configurarPreviewImagem() {
  const inputImagem  = document.querySelector("#input-imagem");
  const container    = document.querySelector("#preview-imagem-container");
  const imgEl        = document.querySelector("#preview-imagem");
  const erroImagem   = document.querySelector("#erro-imagem");

  if (!inputImagem || !container || !imgEl) return;

  const url = inputImagem.value.trim();

  // Campo vazio — oculta o preview sem exibir erro
  if (!url) {
    container.style.display = "none";
    if (erroImagem) erroImagem.textContent = "";
    return;
  }

  // Testa se a URL carrega de verdade antes de exibir
  const testImg = new Image();
  testImg.onload = function () {
    imgEl.src = url;
    container.style.display = "block";
    if (erroImagem) erroImagem.textContent = "";
  };
  testImg.onerror = function () {
    container.style.display = "none";
    if (erroImagem) erroImagem.textContent = "URL inválida ou imagem não encontrada.";
  };
  testImg.src = url;
}

// ─────────────────────────────────────────────────────────────────────────────
// validarFormulario()
// Verifica se os campos obrigatórios estão preenchidos e com valores válidos.
//
// Retorna true se tudo estiver ok — false se houver qualquer erro.
// Os spans .campo-erro são limpos a cada validação para não acumular mensagens.
//
// Por que validar no front-end se o back-end também valida?
//   Validação no front dá feedback imediato — o usuário não precisa esperar
//   o servidor responder para saber que esqueceu de preencher o preço.
//   A validação do back-end é a "barreira de segurança" — nunca confia só
//   no front-end. As duas precisam existir.
// ─────────────────────────────────────────────────────────────────────────────
function validarFormulario() {
  let valido = true;

  // Limpa todos os erros anteriores
  document.querySelectorAll(".campo-erro").forEach(function (span) {
    span.textContent = "";
  });

  const nome      = document.querySelector("#input-nome").value.trim();
  const descricao = document.querySelector("#input-descricao").value.trim();
  const preco     = parseFloat(document.querySelector("#input-preco").value);
  const categoria = document.querySelector("#select-categoria").value;

  if (!nome) {
    document.querySelector("#erro-nome").textContent = "Informe o nome do prato.";
    valido = false;
  }

  if (!descricao) {
    document.querySelector("#erro-descricao").textContent = "Informe a descrição do prato.";
    valido = false;
  }

  if (isNaN(preco) || preco <= 0) {
    document.querySelector("#erro-preco").textContent = "Informe um preço válido (maior que zero).";
    valido = false;
  }

  if (!categoria) {
    document.querySelector("#erro-categoria").textContent = "Selecione uma categoria.";
    valido = false;
  }

  return valido;
}

// ─────────────────────────────────────────────────────────────────────────────
// salvarNovoPrato()                                                       NEW
// Aula 10: ponto central do arquivo — lê o formulário, valida,
// monta o objeto e envia ao servidor via cadastrarProduto() (api.js).
//
// O objeto enviado segue o formato que o back-end espera:
//   { nome, descricao, preco, categoria, imagem }
//   "imagem" é opcional — o back-end aceita null e trata adequadamente.
//
// Fluxo completo:
//   1. validarFormulario() — aborta se houver campo inválido
//   2. desabilita o botão — evita duplo envio enquanto aguarda a resposta
//   3. cadastrarProduto() (api.js) — POST /produtos
//   4. sucesso → feedback verde, limpa formulário, adiciona na lista recentes
//   5. erro    → feedback vermelho, re-habilita o botão para nova tentativa
// ─────────────────────────────────────────────────────────────────────────────
async function salvarNovoPrato() {
  if (!validarFormulario()) return;

  const btnSalvar = document.querySelector("#btn-salvar-prato");
  const feedback  = document.querySelector("#feedback-cadastro");

  const novoPrato = {
    nome:      document.querySelector("#input-nome").value.trim(),
    descricao: document.querySelector("#input-descricao").value.trim(),
    preco:     parseFloat(document.querySelector("#input-preco").value),
    categoria: document.querySelector("#select-categoria").value,
    imagem:    document.querySelector("#input-imagem").value.trim() || null,
  };

  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Salvando...";

  try {
    // ── FETCH API em ação — POST /produtos ─────────────────────────────────
    // cadastrarProduto() (api.js) envia o objeto como JSON ao servidor.
    // O servidor valida os dados, insere no banco e retorna o prato criado
    // com o id gerado automaticamente.
    // Após o sucesso, o prato aparece no cardápio via GET /produtos (main.js).
    const pratoCriado = await cadastrarProduto(novoPrato); // HTTP POST → /produtos

    exibirFeedback(feedback, "sucesso", `✓ Prato "${novoPrato.nome}" cadastrado com sucesso!`);
    adicionarPratoNaListaRecentes(pratoCriado.dados || novoPrato);
    limparFormulario();

    btnSalvar.textContent = "✓ Salvo!";
    btnSalvar.style.backgroundColor = "#27ae60";

    setTimeout(function () {
      btnSalvar.textContent = "✓ Salvar Prato";
      btnSalvar.style.backgroundColor = "";
      btnSalvar.disabled = false;
    }, 2000);

  } catch (erro) {
    exibirFeedback(feedback, "erro", `Erro ao cadastrar: ${erro.message}`);
    btnSalvar.textContent = "✓ Salvar Prato";
    btnSalvar.disabled = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirFeedback(elemento, tipo, mensagem)
// Exibe a mensagem de sucesso ou erro no bloco #feedback-cadastro.
// tipo: "sucesso" | "erro" — aplica a classe CSS correspondente.
// O bloco é ocultado automaticamente após 4 segundos.
// ─────────────────────────────────────────────────────────────────────────────
function exibirFeedback(elemento, tipo, mensagem) {
  if (!elemento) return;

  elemento.textContent  = mensagem;
  elemento.className    = `feedback-${tipo}`;
  elemento.style.display = "block";

  setTimeout(function () {
    elemento.style.display = "none";
  }, 4000);
}

// ─────────────────────────────────────────────────────────────────────────────
// adicionarPratoNaListaRecentes(prato)
// Exibe o prato recém-cadastrado na lista "#lista-recentes" da página.
// Serve como confirmação visual — o admin vê o que foi salvo sem precisar
// ir ao cardápio. A lista não persiste após recarregar (sem localStorage aqui).
// ─────────────────────────────────────────────────────────────────────────────
function adicionarPratoNaListaRecentes(prato) {
  const secaoRecentes = document.querySelector("#secao-recentes");
  const lista         = document.querySelector("#lista-recentes");
  if (!lista || !secaoRecentes) return;

  secaoRecentes.style.display = "block";

  const li = document.createElement("li");
  li.classList.add("item-recente");
  li.innerHTML =
    `<strong>${prato.nome}</strong>` +
    ` <span class="categoria-badge">${prato.categoria}</span>` +
    ` — R$ ${parseFloat(prato.preco).toFixed(2).replace(".", ",")}` +
    `<span class="recente-label">✓ Cadastrado</span>`;

  lista.appendChild(li);
}

// ─────────────────────────────────────────────────────────────────────────────
// limparFormulario()
// Zera todos os campos do formulário e oculta o preview de imagem.
// Chamado após cadastro com sucesso e pelo botão "Limpar".
// ─────────────────────────────────────────────────────────────────────────────
function limparFormulario() {
  const form = document.querySelector("#form-cadastro");
  if (form) form.reset();

  // Limpa erros de validação
  document.querySelectorAll(".campo-erro").forEach(function (span) {
    span.textContent = "";
  });

  // Reseta o contador de caracteres
  const contador = document.querySelector("#contador-descricao");
  if (contador) contador.textContent = "0 / 200";

  // Oculta o preview de imagem
  const container = document.querySelector("#preview-imagem-container");
  if (container) container.style.display = "none";
}


// ─────────────────────────────────────────────────────────────────────────────
// REFERÊNCIA — Estratégia de upload de arquivo (FormData)      COMENTADA
// Aula Futura: substituir o campo URL por <input type="file">.
//
// O que muda:
//   1. HTML: <input type="file" id="input-arquivo" accept="image/*">
//   2. cadastro.js: ler o arquivo e enviar via FormData:
//
//   async function salvarNovoPratoComArquivo() {
//     const arquivo = document.querySelector("#input-arquivo").files[0];
//     const form    = new FormData();
//     form.append("nome",      document.querySelector("#input-nome").value);
//     form.append("descricao", document.querySelector("#input-descricao").value);
//     form.append("preco",     document.querySelector("#input-preco").value);
//     form.append("categoria", document.querySelector("#select-categoria").value);
//     if (arquivo) form.append("imagem", arquivo);
//
//     // NÃO definir Content-Type aqui — o navegador define automaticamente
//     // incluindo o boundary do multipart/form-data.
//     const response = await fetch(`${BASE_URL}/produtos`, {
//       method: "POST",
//       body: form,
//     });
//     const dados = await response.json();
//     if (!response.ok) throw new Error(dados.erro || `Erro ${response.status}`);
//     return dados;
//   }
//
//   3. Back-end (app.js): adicionar multer para receber o arquivo:
//      const multer = require("multer");
//      const upload = multer({ dest: "src/images/" });
//      app.post("/produtos", upload.single("imagem"), rotaProdutos.criar);
//
//   4. Rota criar: usar req.file.filename como nome do arquivo salvo.
// ─────────────────────────────────────────────────────────────────────────────
