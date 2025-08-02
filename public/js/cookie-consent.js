// public/js/cookie-consent.js

document.addEventListener('DOMContentLoaded', () => {
    const consentBanner = document.getElementById('cookie-consent-banner');
    const acceptButton = document.getElementById('cookie-consent-accept');

    // Função que carrega os scripts de rastreamento
    function loadTrackingScripts() {
        // Encontra todos os scripts que precisam de consentimento
        const scripts = document.querySelectorAll('script[data-consent="true"]');
        scripts.forEach(script => {
            // Cria um novo script para que o navegador o execute
            const newScript = document.createElement('script');
            // Copia todos os atributos, como src e async
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // Altera o tipo para que seja executável
            newScript.type = 'text/javascript'; 
            // Substitui o script "falso" pelo script "real"
            script.parentNode.replaceChild(newScript, script);
        });
    }

    // Verifica se o consentimento já foi dado
    if (localStorage.getItem('cookie_consent') === 'true') {
        loadTrackingScripts();
    } else {
        // Se não houver consentimento, mostra o banner
        consentBanner.style.display = 'flex';
    }

    // Quando o botão "Aceitar" é clicado
    acceptButton.addEventListener('click', () => {
        // Guarda a escolha do utilizador
        localStorage.setItem('cookie_consent', 'true');
        // Esconde o banner
        consentBanner.style.display = 'none';
        // Carrega os scripts
        loadTrackingScripts();
    });
});