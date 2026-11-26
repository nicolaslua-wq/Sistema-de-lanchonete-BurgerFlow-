# 🍔 BurguerFlow — Sistema de Hamburgueria Artesanal & Pedidos Online

Projeto Final desenvolvido para a disciplina de **Desenvolvimento de Aplicações Web I (2026)**, aplicando HTML5 semântico, CSS3 moderno, Bootstrap 5, acessibilidade web e interatividade com JavaScript.

🔗 **Acesse o site online:** [https://nicolaslua-wq.github.io/Sistema-de-lanchonete-BurgerFlow-/](https://nicolaslua-wq.github.io/Sistema-de-lanchonete-BurgerFlow-/)

---

## 👥 Equipe Desenvolvedora
* **Nicolas Luâ Nunes Paulino**
* **Izabela Marcêdo**
* **Maria Eduarda Cantalice**

---

## 🎯 Sobre o Projeto
O **BurguerFlow** é uma plataforma web responsiva para uma hamburgueria artesanal fictícia, projetada para agilizar pedidos online e evitar erros na personalização de ingredientes.

### Funcionalidades Implementadas
* **Página Inicial (`index.html`):** Banner de apresentação, vitrine com os hambúrgueres mais pedidos e diferenciais da casa.
* **Cardápio Interativo (`paginas/cardapio.html`):** Busca textual em tempo real e filtros dinâmicos por categoria (*Artesanais, Veganos, Acompanhamentos e Bebidas*).
* **Personalização (`paginas/detalhes.html`):** Configuração completa de pão, ponto da carne e adicionais extras com cálculo automático de valor.
* **Carrinho e Checkout (`paginas/pedido.html`):** Gestão de quantidades via `localStorage`, aplicação de cupom promocional (`FLOW10`), cálculo de entrega/troco e validação de formulário HTML5.
* **Sobre & Contato (`paginas/contato.html`):** História da marca, horários de funcionamento, mapa interativo e formulário de atendimento.
* **Acessibilidade:** Navegação por teclado (`:focus-visible`), link de salto (*skip-link*), atributos ARIA e botão de **Modo Alto Contraste** persistente em todas as páginas.

---

## 🛠️ Tecnologias Utilizadas
* **HTML5 Semântico** (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
* **CSS3 Próprio** (Variáveis CSS, CSS Grid, Flexbox, Media Queries e tema Alto Contraste)
* **Bootstrap 5.3** (Componentes responsivos e sistema de grid auxiliar)
* **JavaScript (ES6+)** (Manipulação do DOM, eventos e persistência com `localStorage`)

---

## 📁 Estrutura de Arquivos
```text
Sistema-de-lanchonete-BurgerFlow-/
 ├── index.html
 ├── README.md
 ├── css/
 │    └── style.css
 ├── js/
 │    └── script.js
 └── paginas/
      ├── cardapio.html
      ├── detalhes.html
      ├── pedido.html
      └── contato.html
