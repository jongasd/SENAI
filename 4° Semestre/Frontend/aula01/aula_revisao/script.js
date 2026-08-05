class Prato {
    constructor(nome, preco, categoria){
        this.nome = nome
        this.preco = preco
        this.categoria = categoria
    }

    formatarPreco(){
        return `R$ ${this.preco.toFixed(2).replace('.',',')}`
    }
    aplicarDesconto(percent){
        this.preco *= (1 - percent/100)
    }
}

let novoPrato = new Prato("Lasanha", 40.00, "Comida")