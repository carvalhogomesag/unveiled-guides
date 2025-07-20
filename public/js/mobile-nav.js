const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.fullscreen-nav');
const body = document.body;

mobileNavToggle.addEventListener('click', () => {
    const isVisible = primaryNav.getAttribute('data-visible');

    if (isVisible === 'false') {
        primaryNav.setAttribute('data-visible', true);
        mobileNavToggle.setAttribute('aria-expanded', true);
        body.classList.add('body--nav-open');
    } else {
        primaryNav.setAttribute('data-visible', false);
        mobileNavToggle.setAttribute('aria-expanded', false);
        body.classList.remove('body--nav-open');
    }
});

// Fechar o menu ao clicar num link
document.querySelectorAll('.fullscreen-nav__link').forEach(link => {
    link.addEventListener('click', () => {
        primaryNav.setAttribute('data-visible', false);
        mobileNavToggle.setAttribute('aria-expanded', false);
        body.classList.remove('body--nav-open');
    });
});