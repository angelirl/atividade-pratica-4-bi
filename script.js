let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const listaProdutos = document.getElementById("lista-produtos");
const listaCarrinho = document.getElementById("lista-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");
const valorTotal = document.getElementById("valor-total");
const busca = document.getElementById("busca");
const filtroCategoria = document.getElementById("filtro-categoria");
const botaoLimpar = document.getElementById("limpar-carrinho");

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function renderizarProdutos() {
    const termo = busca.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;

    const filtrados = produtos.filter(produto => {
        const correspondeNome = produto.nome
            .toLowerCase()
            .includes(termo);

        const correspondeCategoria =
            categoria === "todos" ||
            produto.categoria === categoria;

        return correspondeNome && correspondeCategoria;
    });

    listaProdutos.innerHTML = "";

    if (filtrados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum produto encontrado.";
        listaProdutos.appendChild(mensagem);
        return;
    }

    filtrados.forEach(produto => {
        const card = document.createElement("article");
        card.className = "produto";

        const titulo = document.createElement("h3");
        titulo.textContent = produto.nome;

        const categoriaElemento = document.createElement("p");
        categoriaElemento.textContent = produto.categoria;

        const descricao = document.createElement("p");
        descricao.textContent = produto.descricao;

        const preco = document.createElement("p");
        preco.textContent = formatarPreco(produto.preco);

        const botao = document.createElement("button");
        botao.textContent = "Adicionar ao carrinho";

        botao.addEventListener("click", () => {
            adicionarCarrinho(produto.id);
        });

        card.append(
            titulo,
            categoriaElemento,
            descricao,
            preco,
            botao
        );

        listaProdutos.appendChild(card);
    });
}


function adicionarCarrinho(id) {
    const produto = produtos.find(item => item.id === id);

    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    renderizarCarrinho();

    const secaoCarrinho = document.getElementById("carrinho");

    secaoCarrinho.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    secaoCarrinho.classList.remove("carrinho-destaque");

    void secaoCarrinho.offsetWidth;

    secaoCarrinho.classList.add("carrinho-destaque");

    setTimeout(() => {
        secaoCarrinho.classList.remove("carrinho-destaque");
    }, 1800);
}


function removerCarrinho(id) {
    const item = carrinho.find(item => item.id === id);

    if (!item) return;

    if (item.quantidade > 1) {
        item.quantidade--;
    } else {
        carrinho = carrinho.filter(item => item.id !== id);
    }

    salvarCarrinho();
    renderizarCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function renderizarCarrinho() {
    listaCarrinho.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        listaCarrinho.textContent = "Seu carrinho está vazio.";
    }

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        quantidadeTotal += item.quantidade;

        const linha = document.createElement("div");
        linha.className = "item-carrinho";

        const informacao = document.createElement("span");
        informacao.textContent =
            `${item.nome} — ${item.quantidade}x — ` +
            formatarPreco(item.preco * item.quantidade);

        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.addEventListener("click", () => {
            removerCarrinho(item.id);
        });

        linha.append(informacao, botaoRemover);
        listaCarrinho.appendChild(linha);
    });

    contadorCarrinho.textContent = quantidadeTotal;
    valorTotal.textContent = formatarPreco(total);
}

botaoLimpar.addEventListener("click", () => {
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
});

busca.addEventListener("input", renderizarProdutos);
filtroCategoria.addEventListener("change", renderizarProdutos);

renderizarProdutos();
renderizarCarrinho();
