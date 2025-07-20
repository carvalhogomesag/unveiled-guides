const NewsAPI = require('newsapi');
const nodemailer = require('nodemailer');

// --- CONFIGURAÇÃO OTIMIZADA ---

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const newsapi = new NewsAPI(NEWS_API_KEY);

// 1. QUERY DE PESQUISA MAIS ABRANGENTE
// Usamos aspas para frases exatas e 'OR' para alternativas.
// Adicionamos termos mais genéricos como "cultura" e "exposição" ligados a "Lisboa".
const SEARCH_QUERY =
    '"transporte público Lisboa" OR "greve metro" OR "greve CP" OR ' +
    '"novo museu Lisboa" OR "exposição imersiva" OR "concerto Lisboa" OR ' +
    '"festival Lisboa" OR "Time Out Market" OR "LX Factory eventos" OR ' +
    '"monumentos Lisboa" OR "passeio Tejo" OR "Oceanário novidades"';

// 2. FONTES DE NOTÍCIAS PORTUGUESAS RELEVANTES
// Focar a pesquisa nestas fontes aumenta a qualidade.
// (Obtive estes IDs a partir da documentação da News API)
const PORTUGUESE_SOURCES = 'publico.pt, observador.pt, expresso.pt, dn.pt, jn.pt, sapo.pt, nit.pt';

// 3. Configuração do email (continua igual)
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

// --- FIM DA CONFIGURAÇÃO ---


async function findRelevantNews() {
    console.log(`Iniciando busca por notícias em fontes portuguesas...`);
    try {
        const response = await newsapi.v2.everything({
            q: SEARCH_QUERY,
            sources: PORTUGUESE_SOURCES, // <-- NOVA OPÇÃO: Focar nestas fontes
            language: 'pt',
            sortBy: 'publishedAt', // Ordenar por mais recente para garantir que apanhamos as últimas
            pageSize: 50 // Pedir mais artigos para aumentar a probabilidade de encontrar algo
        });

        console.log(`API encontrou um total de ${response.totalResults} resultados. A filtrar os das últimas 24h...`);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 2); // Aumentar a janela para 48h para não perder nada
        
        const recentArticles = response.articles.filter(article => {
            const pubDate = new Date(article.publishedAt);
            return pubDate > yesterday;
        });

        console.log(`Encontrados ${recentArticles.length} artigos relevantes nas últimas 48h.`);

        // Enviar o email independentemente do resultado
        await sendNewsEmail(recentArticles);

    } catch (error) {
        console.error('Erro ao comunicar com a News API:', error.message);
    }
}

async function sendNewsEmail(articles) {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    let emailBody;
    const subject = `💡 ${articles.length} Novas Ideias de Artigos para Unveiled Guides`;

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
            <p>O robô de notícias foi executado com sucesso, mas não encontrou nenhum artigo novo relevante nas últimas 48 horas com base nos termos de pesquisa atuais.</p>
            <p>Isto confirma que o sistema está a funcionar. Se continuar a não encontrar nada, podemos refinar a query de pesquisa novamente.</p>
        `;
    }

    const mailOptions = {
        from: `"Unveiled Guides Robot" <${EMAIL_CONFIG.auth.user}>`,
        to: RECIPIENT_EMAIL,
        subject: subject,
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