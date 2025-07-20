// Seleciona os elementos principais com os quais vamos interagir
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.main-nav'); // O nosso <ul> com os links
const body = document.body;

// Adiciona um "ouvinte" de eventos de clique ao botão hambúrguer
mobileNavToggle.addEventListener('click', () => {
    // Verifica o estado atual do menu (se está visível ou não)
    const isVisible = primaryNav.getAttribute('data-visible');

    // Se o menu NÃO estiver visível...
    if (isVisible === 'false') {
        // ...torna-o visível
        primaryNav.setAttribute('data-visible', true);
        // Atualiza o botão para o estado "aberto" (para leitores de ecrã)
        mobileNavToggle.setAttribute('aria-expanded', true);
        // Adiciona uma classe ao body para bloquear o scroll
        body.classList.add('body--nav-open');
    } else { // Se o menu JÁ estiver visível...
        // ...esconde-o
        primaryNav.setAttribute('data-visible', false);
        // Atualiza o botão para o estado "fechado"
        mobileNavToggle.setAttribute('aria-expanded', false);
        // Remove a classe do body para desbloquear o scroll
        body.classList.remove('body--nav-open');
    }
});