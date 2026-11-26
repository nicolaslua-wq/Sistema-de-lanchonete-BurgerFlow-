/* =========================================================
   BURGUERFLOW - LÓGICA JAVASCRIPT E MANIPULAÇÃO DO DOM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. MODO ALTO CONTRASTE (ACESSIBILIDADE)
  const btnContraste = document.getElementById("btn-contraste");
  if (localStorage.getItem("altoContraste") === "true") {
    document.body.classList.add("alto-contraste");
    if (btnContraste) btnContraste.setAttribute("aria-pressed", "true");
  }

  if (btnContraste) {
    btnContraste.addEventListener("click", () => {
      const ativo = document.body.classList.toggle("alto-contraste");
      btnContraste.setAttribute("aria-pressed", String(ativo));
      localStorage.setItem("altoContraste", String(ativo));
    });
  }

  // 2. GERENCIAMENTO DO CARRINHO (LOCALSTORAGE)
  let carrinho = JSON.parse(localStorage.getItem("carrinhoBurguerFlow")) || [];
  let descontoPercentual = 0;

  function salvarCarrinho() {
    localStorage.setItem("carrinhoBurguerFlow", JSON.stringify(carrinho));
    atualizarBadgeCarrinho();
  }

  function atualizarBadgeCarrinho() {
    const badges = document.querySelectorAll("#contador-carrinho");
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    badges.forEach((b) => (b.textContent = totalItens));
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function adicionarAoCarrinho(id, nome, preco, quantidade = 1) {
    const existente = carrinho.find((item) => item.id === id && item.nome === nome);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      carrinho.push({ id, nome, preco: parseFloat(preco), quantidade });
    }
    salvarCarrinho();
    alert(`"${nome}" adicionado ao seu pedido!`);
  }

  // Botões "+ Adicionar" / "+ Pedir" na Home e no Cardápio
  const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
  botoesAdicionar.forEach((botao) => {
    botao.addEventListener("click", () => {
      const { id, nome, preco } = botao.dataset;
      adicionarAoCarrinho(id, nome, preco, 1);
    });
  });

  atualizarBadgeCarrinho();

  // 3. FILTRO E BUSCA NO CARDÁPIO (cardapio.html)
  const campoBusca = document.getElementById("campo-busca");
  const botoesFiltro = document.querySelectorAll(".btn-filtro");
  const itensCardapio = document.querySelectorAll(".item-cardapio");
  const mensagemVazia = document.getElementById("mensagem-vazia");
  let categoriaAtual = "todos";

  function filtrarCardapio() {
    if (!itensCardapio.length) return;
    const termo = campoBusca ? campoBusca.value.toLowerCase().trim() : "";
    let visiveis = 0;

    itensCardapio.forEach((card) => {
      const cat = card.dataset.categoria;
      const nome = card.dataset.nome.toLowerCase();
      const bateCategoria = categoriaAtual === "todos" || cat === categoriaAtual;
      const bateBusca = nome.includes(termo);

      if (bateCategoria && bateBusca) {
        card.style.display = "flex";
        visiveis++;
      } else {
        card.style.display = "none";
      }
    });

    if (mensagemVazia) {
      mensagemVazia.classList.toggle("d-none", visiveis > 0);
    }
  }

  if (campoBusca) {
    campoBusca.addEventListener("input", filtrarCardapio);
  }

  botoesFiltro.forEach((btn) => {
    btn.addEventListener("click", () => {
      botoesFiltro.forEach((b) => {
        b.classList.remove("btn-burguer", "active");
        b.classList.add("btn-outline-secondary");
      });
      btn.classList.remove("btn-outline-secondary");
      btn.classList.add("btn-burguer", "active");
      categoriaAtual = btn.dataset.categoria;
      filtrarCardapio();
    });
  });

  // 4. PERSONALIZAÇÃO DO LANCHE (detalhes.html)
  const formPersonalizar = document.getElementById("form-personalizar");
  if (formPersonalizar) {
    const precoBase = 29.9;
    const extrasCheckboxes = document.querySelectorAll(".extra-item");
    const inputQtd = document.getElementById("qtd-personalizado");
    const displayPreco = document.getElementById("preco-personalizado");

    function calcularTotalPersonalizado() {
      let extrasTotal = 0;
      extrasCheckboxes.forEach((chk) => {
        if (chk.checked) extrasTotal += parseFloat(chk.dataset.preco);
      });
      const qtd = parseInt(inputQtd.value) || 1;
      const total = (precoBase + extrasTotal) * qtd;
      displayPreco.textContent = formatarMoeda(total);
      return { unitario: precoBase + extrasTotal, qtd };
    }

    extrasCheckboxes.forEach((chk) => chk.addEventListener("change", calcularTotalPersonalizado));
    inputQtd.addEventListener("input", calcularTotalPersonalizado);

    formPersonalizar.addEventListener("submit", (e) => {
      e.preventDefault();
      const pao = document.querySelector('input[name="pao"]:checked').value;
      const ponto = document.querySelector('input[name="ponto"]:checked').value;
      const extrasSelecionados = Array.from(extrasCheckboxes)
        .filter((c) => c.checked)
        .map((c) => c.value);

      const { unitario, qtd } = calcularTotalPersonalizado();
      const resumoExtras = extrasSelecionados.length ? ` + ${extrasSelecionados.join(", ")}` : "";
      const nomeCustom = `Burguer Custom (${pao}, ${ponto}${resumoExtras})`;

      adicionarAoCarrinho("custom-" + Date.now(), nomeCustom, unitario, qtd);
      formPersonalizar.reset();
      calcularTotalPersonalizado();
    });
  }

  // 5. CARRINHO E CHECKOUT (pedido.html)
  const tabelaCarrinho = document.getElementById("tabela-carrinho");
  if (tabelaCarrinho) {
    const avisoVazio = document.getElementById("carrinho-vazio-aviso");
    const elSubtotal = document.getElementById("valor-subtotal");
    const elEntrega = document.getElementById("valor-entrega");
    const elDesconto = document.getElementById("valor-desconto");
    const elTotal = document.getElementById("valor-total");

    function renderizarCarrinho() {
      tabelaCarrinho.innerHTML = "";
      if (carrinho.length === 0) {
        avisoVazio.classList.remove("d-none");
        elSubtotal.textContent = "R$ 0,00";
        elEntrega.textContent = "R$ 0,00";
        elDesconto.textContent = "- R$ 0,00";
        elTotal.textContent = "R$ 0,00";
        return;
      }

      avisoVazio.classList.add("d-none");
      let subtotal = 0;

      carrinho.forEach((item, index) => {
        const subItem = item.preco * item.quantidade;
        subtotal += subItem;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${item.nome}</strong><br><small>${formatarMoeda(item.preco)} un.</small></td>
          <td>
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-secondary btn-menos" data-index="${index}">-</button>
              <span class="btn btn-light disabled">${item.quantidade}</span>
              <button type="button" class="btn btn-outline-secondary btn-mais" data-index="${index}">+</button>
            </div>
          </td>
          <td>${formatarMoeda(subItem)}</td>
          <td><button type="button" class="btn btn-sm btn-danger btn-remover" data-index="${index}" aria-label="Remover item">X</button></td>
        `;
        tabelaCarrinho.appendChild(tr);
      });

      const entrega = 6.0;
      const desconto = subtotal * descontoPercentual;
      const total = subtotal + entrega - desconto;

      elSubtotal.textContent = formatarMoeda(subtotal);
      elEntrega.textContent = formatarMoeda(entrega);
      elDesconto.textContent = `- ${formatarMoeda(desconto)}`;
      elTotal.textContent = formatarMoeda(total);

      document.querySelectorAll(".btn-menos").forEach((b) =>
        b.addEventListener("click", () => {
          const i = b.dataset.index;
          if (carrinho[i].quantidade > 1) carrinho[i].quantidade--;
          else carrinho.splice(i, 1);
          salvarCarrinho();
          renderizarCarrinho();
        })
      );

      document.querySelectorAll(".btn-mais").forEach((b) =>
        b.addEventListener("click", () => {
          const i = b.dataset.index;
          carrinho[i].quantidade++;
          salvarCarrinho();
          renderizarCarrinho();
        })
      );

      document.querySelectorAll(".btn-remover").forEach((b) =>
        b.addEventListener("click", () => {
          carrinho.splice(b.dataset.index, 1);
          salvarCarrinho();
          renderizarCarrinho();
        })
      );
    }

    renderizarCarrinho();

    // Limpar carrinho
    document.getElementById("btn-limpar-carrinho").addEventListener("click", () => {
      carrinho = [];
      salvarCarrinho();
      renderizarCarrinho();
    });

    // Cupom FLOW10
    document.getElementById("btn-aplicar-cupom").addEventListener("click", () => {
      const code = document.getElementById("input-cupom").value.trim().toUpperCase();
      const feedback = document.getElementById("feedback-cupom");
      if (code === "FLOW10") {
        descontoPercentual = 0.1;
        feedback.textContent = "Cupom FLOW10 aplicado! 10% de desconto no subtotal.";
        feedback.className = "small fw-bold text-success mb-3";
      } else {
        descontoPercentual = 0;
        feedback.textContent = "Cupom inválido. Tente FLOW10.";
        feedback.className = "small fw-bold text-danger mb-3";
      }
      renderizarCarrinho();
    });

    // Exibir campo de troco se pagamento = Dinheiro
    const radiosPagamento = document.querySelectorAll(".radio-pagamento");
    const grupoTroco = document.getElementById("grupo-troco");
    radiosPagamento.forEach((radio) => {
      radio.addEventListener("change", () => {
        grupoTroco.classList.toggle("d-none", radio.value !== "Dinheiro");
      });
    });

    // Envio do Checkout
    const formCheckout = document.getElementById("form-checkout");
    formCheckout.addEventListener("submit", (e) => {
      e.preventDefault();
      if (carrinho.length === 0) {
        alert("Adicione pelo menos um item ao carrinho antes de finalizar!");
        return;
      }
      const nomeCliente = document.getElementById("cliente-nome").value;
      const msgSucesso = document.getElementById("mensagem-pedido-sucesso");
      msgSucesso.innerHTML = `<strong>Pedido confirmado, ${nomeCliente}!</strong> Seu lanche já está na chapa. Tempo estimado: 35 minutos.`;
      msgSucesso.classList.remove("d-none");

      carrinho = [];
      salvarCarrinho();
      renderizarCarrinho();
      formCheckout.reset();
    });
  }

  // 6. FORMULÁRIO DE CONTATO (contato.html)
  const formContato = document.getElementById("form-contato");
  if (formContato) {
    formContato.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("contato-nome").value;
      const feedback = document.getElementById("feedback-contato");
      feedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`;
      feedback.classList.remove("d-none");
      formContato.reset();
    });
  }
});