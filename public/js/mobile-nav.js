const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.body;

mobileNavToggle.addEventListener('click', () => {
    const isVisible = mainNav.getAttribute('data-visible');

    if (isVisible === 'false') {
        mainNav.setAttribute('data-visible', true);
        mobileNavToggle.setAttribute('aria-expanded', true);
        body.classList.add('body--nav-open');
    } else {
        mainNav.setAttribute('data-visible', false);
        mobileNavToggle.setAttribute('aria-expanded', false);
        body.classList.remove('body--nav-open');
    }
});