// Importa as bibliotecas que instalámos
const Parser = require('rss-parser');
const nodemailer = require('nodemailer');

// --- CONFIGURAÇÃO (Altere estes valores) ---

// 1. Fontes de notícias (RSS Feeds)
const RSS_FEEDS = [
    'https://www.timeout.pt/lisboa/pt/rss',
    'https://www.publico.pt/api/rss/local/lisboa',
    'https://observador.pt/feed/cultura/',
    'https://www.jn.pt/rss/cultura-e-lazer.xml'
];

// 2. Palavras-chave para procurar nos títulos
const KEYWORDS = [
    'museu', 'exposição', 'concerto', 'festival', 'festa',
    'aeroporto', 'turismo', 'monumento', 'castelo', 'palácio', 
    'feriado', 'grátis', 'inaugura', 'restauro', 'belém', 'sintra',
    'alfama', 'jeronimos', 'praia',
];

// 3. Configuração do seu email (IMPORTANTE!)
// Use um serviço como o Gmail. Você precisará de uma "App Password".
// Veja como criar uma: https://support.google.com/accounts/answer/185833
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Lê do segredo
        pass: process.env.EMAIL_PASS     // Lê do segredo
    }
};
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL; // Lê do segredo   

// --- FIM DA CONFIGURAÇÃO ---


// Função principal do nosso robô
async function findRelevantNews() {
    console.log('Iniciando busca por notícias relevantes...');
    const parser = new Parser();
    let relevantArticles = [];

    // Loop por cada RSS Feed
    for (const feedUrl of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);
            console.log(`Lendo feed: ${feed.title}`);

            feed.items.forEach(item => {
                const title = item.title.toLowerCase();
                // Verifica se o título contém alguma das nossas palavras-chave
                if (KEYWORDS.some(keyword => title.includes(keyword))) {
                    // Verifica se o artigo é recente (publicado nas últimas 24h)
                    const pubDate = new Date(item.pubDate);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (pubDate > yesterday) {
                        relevantArticles.push({
                            title: item.title,
                            link: item.link,
                            source: feed.title
                        });
                    }
                }
            });
        } catch (error) {
            console.error(`Erro ao ler o feed ${feedUrl}:`, error.message);
        }
    }

    console.log(`Encontrados ${relevantArticles.length} artigos relevantes.`);

    // Se encontrámos artigos, envia o email
    if (relevantArticles.length > 0) {
        await sendNewsEmail(relevantArticles);
    } else {
        console.log('Nenhum artigo novo para reportar. Terminando.');
    }
}

// Função para enviar o email
async function sendNewsEmail(articles) {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    // Formata a lista de artigos para o corpo do email
    const emailBody = `
        <h2>Unveiled Guides - Resumo de Notícias de Hoje</h2>
        <p>Foram encontrados ${articles.length} artigos que podem ser de interesse:</p>
        <ul>
            ${articles.map(article => `
                <li>
                    <strong>${article.title}</strong><br>
                    <em>Fonte: ${article.source}</em><br>
                    <a href="${article.link}">Ler artigo completo</a>
                </li>
            `).join('')}
        </ul>
    `;

    const mailOptions = {
        from: `"Unveiled Guides Robot" <${EMAIL_CONFIG.auth.user}>`,
        to: RECIPIENT_EMAIL,
        subject: '💡 Ideias de Artigos para Unveiled Guides',
        html: emailBody
    };

    try {
        console.log('Enviando email de resumo...');
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o email:', error);
    }
}

// Executa a função principal
findRelevantNews();