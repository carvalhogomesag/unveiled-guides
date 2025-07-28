// Sintaxe antiga e robusta (CommonJS)
const slugify = require("slugify");
const nestingToc = require('eleventy-plugin-nesting-toc');

module.exports = function(eleventyConfig) {
    
    // --- PASSTHROUGH (Cópia de Assets) ---
    // Copia o CONTEÚDO da pasta 'public' para a raiz do site final.
    eleventyConfig.addPassthroughCopy({ "public/": "/" });
    
    // --- PLUGINS ---
    // Plugin da Tabela de Conteúdos
    eleventyConfig.addPlugin(nestingToc, {
        tags: ['h2', 'h3'],
        wrapper: 'div',
        wrapperClass: 'toc',
        headingText: 'On This Page',
        headingClass: 'toc-title'
    });

    // --- FILTROS DE TEMPLATE ---
    // Filtro para criar URLs amigáveis (usado nas tags)
    eleventyConfig.addFilter("slugify", function(str) {
        return slugify(str, { lower: true, strict: true, remove: /["]/g });
    });
    
    // --- COLEÇÕES ---
    // Define a coleção "post" a partir dos nossos artigos e ordena por data
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./content/posts/**/*.md").sort((a, b) => {
            return b.date - a.date; // Ordena do mais novo para o mais antigo
        });
    });

    // --- CONFIGURAÇÃO PRINCIPAL DO ELEVENTY ---
    // Define as pastas de entrada/saída e os motores de template
    return {
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "content",
            includes: "../_includes",
            data: "../_data",
            output: "_site"
        },
        passthroughFileCopy: true
    };
};