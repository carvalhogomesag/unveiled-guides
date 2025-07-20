console.log("DEBUG: mobile-nav.js SCRIPT CARREGADO");

// Seleciona os elementos principais com os quais vamos interagir
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.main-nav'); // O nosso <ul> com os links
const body = document.body;

// Verifica se os elementos foram encontrados
if (!mobileNavToggle) {
    console.error("DEBUG ERROR: Botão .mobile-nav-toggle NÃO ENCONTRADO!");
}
if (!primaryNav) {
    console.error("DEBUG ERROR: Navegação .main-nav NÃO ENCONTRADA!");
}

// Adiciona um "ouvinte" de eventos de clique ao botão hambúrguer
if (mobileNavToggle && primaryNav) {
    mobileNavToggle.addEventListener('click', () => {
        console.log("DEBUG: Botão Hambúrguer Clicado!");
        
        // Verifica o estado atual do menu (se está visível ou não)
        const isVisible = primaryNav.getAttribute('data-visible');
        console.log("DEBUG: Estado atual de data-visible é:", isVisible);

        // Se o menu NÃO estiver visível...
        if (isVisible === 'false') {
            // ...torna-o visível
            primaryNav.setAttribute('data-visible', true);
            mobileNavToggle.setAttribute('aria-expanded', true);
            body.classList.add('body--nav-open');
            console.log("DEBUG: Estado alterado para VISÍVEL (true)");
        } else { // Se o menu JÁ estiver visível...
            // ...esconde-o
            primaryNav.setAttribute('data-visible', false);
            mobileNavToggle.setAttribute('aria-expanded', false);
            body.classList.remove('body--nav-open');
            console.log("DEBUG: Estado alterado para ESCONDIDO (false)");
        }
    });
    console.log("DEBUG: Ouvinte de clique adicionado com sucesso.");
}