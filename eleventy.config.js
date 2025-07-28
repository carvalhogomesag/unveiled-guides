// Importa os plugins do template base (sintaxe ES Module)
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";

// Importa os NOSSOS plugins e módulos (sintaxe ES Module)
import slugify from "slugify";
import nestingToc from 'eleventy-plugin-nesting-toc';

export default function(eleventyConfig) {
    
    // --- PASSTHROUGH (Cópia de Assets) ---
    // Copia o CONTEÚDO da pasta 'public' para a raiz do site final.
    // Exemplo: public/css/style.css -> _site/css/style.css
    eleventyConfig.addPassthroughCopy({ "public/": "/" });
    
    // --- PLUGINS ---
    // Plugins do Eleventy Base Blog (essenciais para o template funcionar)
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight, { preAttributes: { tabindex: 0 } });
    eleventyConfig.addPlugin(pluginNavigation);
    
    // Nosso plugin da Tabela de Conteúdos
    eleventyConfig.addPlugin(nestingToc, {
        tags: ['h2', 'h3'], // Quais cabeçalhos devem entrar na TOC
        wrapper: 'div',           // Elemento HTML que envolve a TOC
        wrapperClass: 'toc',      // Classe CSS para o contentor da TOC
        headingText: 'On This Page', // Título visível da TOC
        headingClass: 'toc-title'  // Classe CSS para o título da TOC
    });

    // --- FILTROS DE TEMPLATE ---
    // Filtro para criar URLs amigáveis (usado nas tags)
    eleventyConfig.addFilter("slugify", function(str) {
        return slugify(str, { lower: true, strict: true, remove: /["]/g });
    });
    
    // --- COLEÇÕES ---
    // Define a coleção "post" a partir dos nossos artigos e ordena por data
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./content/posts/**/*.md").sort((a, b) => b.date - a.date);
    });

    // --- CONFIGURAÇÃO PRINCIPAL DO ELEVENTY ---
    // Define as pastas de entrada/saída e os motores de template
    return {
        templateFormats: ["md", "njk", "html"], // Formatos de ficheiro a processar
        markdownTemplateEngine: "njk",         // Processar Markdown com Nunjucks
        htmlTemplateEngine: "njk",             // Processar HTML com Nunjucks
        dir: {
            input: "content",         // Pasta onde está o nosso conteúdo principal
            includes: "../_includes", // Onde estão os nossos layouts e componentes
            data: "../_data",         // Onde estão os nossos ficheiros de dados globais
            output: "_site"           // Pasta onde o site final será gerado
        },
        passthroughFileCopy: true // Permite que ficheiros estáticos sejam copiados
    };
};