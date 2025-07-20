// Importa a biblioteca da News API e do Nodemailer
const NewsAPI = require('newsapi');
const nodemailer = require('nodemailer');

// --- CONFIGURAÇÃO (Altere estes valores) ---

// 1. A sua chave da News API (será lida dos segredos do GitHub)
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const newsapi = new NewsAPI(NEWS_API_KEY);

// 2. O seu termo de pesquisa principal
const SEARCH_QUERY = '"turismo Lisboa" OR "eventos Lisboa" OR "museus Lisboa"';

// 3. Configuração do seu email (lido dos segredos do GitHub)
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

// 4. Para onde enviar o email
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

// --- FIM DA CONFIGURAÇÃO ---


async function findRelevantNews() {
    console.log(`Iniciando busca por notícias com a query: ${SEARCH_QUERY}`);
    try {
        const response = await newsapi.v2.everything({
            q: SEARCH_QUERY,
            language: 'pt', // Procurar por notícias em Português
            sortBy: 'relevancy', // Ordenar por relevância
            pageSize: 20 // Pedir os 20 artigos mais relevantes
        });

        console.log(`Encontrados ${response.totalResults} resultados. A processar os mais recentes...`);
        
        // Filtra apenas os artigos publicados nas últimas 24 horas
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const recentArticles = response.articles.filter(article => {
            const pubDate = new Date(article.publishedAt);
            return pubDate > yesterday;
        });

        console.log(`Encontrados ${recentArticles.length} artigos relevantes nas últimas 24h.`);

        if (recentArticles.length > 0) {
            await sendNewsEmail(recentArticles);
        } else {
            console.log('Nenhum artigo novo para reportar.');
            // Opcional: Enviar um email de "tudo calmo"
            await sendNewsEmail([]); 
        }

    } catch (error) {
        console.error('Erro ao comunicar com a News API:', error.message);
        // Opcional: Enviar um email de erro para si mesmo
    }
}

async function sendNewsEmail(articles) {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    let emailBody;

    if (articles.length > 0) {
        emailBody = `
            <h2>Unveiled Guides - Resumo de Notícias de Hoje</h2>
            <p>Foram encontrados ${articles.length} artigos que podem ser de interesse:</p>
            <ul>
                ${articles.map(article => `
                    <li style="margin-bottom: 15px;">
                        <strong>${article.title}</strong><br>
                        <em>Fonte: ${article.source.name}</em><br>
                        <p>${article.description || 'Sem descrição disponível.'}</p>
                        <a href="${article.url}">Ler artigo completo</a>
                    </li>
                `).join('')}
            </ul>
        `;
    } else {
        emailBody = `
            <h2>Unveiled Guides - Relatório Diário</h2>
            <p>O robô de notícias foi executado com sucesso, mas não encontrou nenhum artigo novo relevante nas últimas 24 horas.</p>
            <p>Isto confirma que o sistema está a funcionar corretamente.</p>
        `;
    }

    const mailOptions = {
        from: `"Unveiled Guides Robot" <${EMAIL_CONFIG.auth.user}>`,
        to: RECIPIENT_EMAIL,
        subject: `💡 ${articles.length} Ideias de Artigos para Unveiled Guides`,
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

findRelevantNews();