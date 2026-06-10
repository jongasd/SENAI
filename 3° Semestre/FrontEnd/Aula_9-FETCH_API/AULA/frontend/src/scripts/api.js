var BASE_URL = "http://localhost:3000";

async function buscarProdutos() {
  var response = await fetch(BASE_URL + "/produtos");
  if (!response.ok)
    throw new Error("Erro ao buscar produtos: " + response.status);
  return await response.json();
}

async function criarPedido(cliente, itens) {
  var response = await fetch(BASE_URL + "/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cliente: cliente, itens: itens }),
  });
  if (!response.ok) throw new Error("Erro ao criar pedido: " + response.status);
  return await response.json();
}

async function buscarPedidos() {
  var response = await fetch(BASE_URL + "/pedidos");
  if (!response.ok)
    throw new Error("Erro ao buscar pedidos: " + response.status);
  return await response.json();
}

async function atualizarStatusPedido(id, novoStatus) {
  var response = await fetch(BASE_URL + "/pedidos/" + id + "/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }),
  });
  if (!response.ok)
    throw new Error("Erro ao atualizar status: " + response.status);
  return await response.json();
}
