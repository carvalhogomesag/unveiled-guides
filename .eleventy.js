const slugify = require("slugify");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

// Esta é a sintaxe CommonJS padrão para configurações do Eleventy.
module.exports = function(eleventyConfig) {

    // Configuração do Markdown-It para adicionar IDs aos títulos
    const md = markdownIt({ html: true }).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.ariaHidden({
            placement: "after",
            class: "direct-link",
            symbol: "#",
        }),
        level: [2, 3],
        slugify: (str) => slugify(str, { lower: true, strict: true, remove: /["]/g })
    });
    eleventyConfig.setLibrary("md", md);

    // Adiciona os filtros ao Nunjucks.
    eleventyConfig.addNunjucksFilter("generateToc", (content) => {
        if (!content) return '';
        
        const headers = content.match(/<h([2-3]) id="([^"]+)">([^<]+)<\/h[2-3]>/g) || [];
        if (headers.length === 0) return '';

        let tocHtml = '<div class="toc"><h4 class="toc-title">On This Page</h4><ul>';
        headers.forEach(header => {
            const [,, id, text] = header.match(/<h[2-3] id="([^"]+)">([^<]+)<\/h[2-3]>/);
            tocHtml += `<li><a href="#${id}">${text}</a></li>`;
        });
        tocHtml += '</ul></div>';
        
        return tocHtml;
    });
    
    eleventyConfig.addNunjucksFilter("slugify", (str) => {
        return slugify(str, { lower: true, strict: true, remove: /["]/g });
    });

    // Coleções
    // ----------------------------------------------------------------

    // Coleção de posts
    eleventyConfig.addCollection("post", (collectionApi) => {
        return collectionApi.getFilteredByTag("post").sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    // Cria uma coleção limpa e única de todas as tags para evitar conflitos.
    eleventyConfig.addCollection("tagList", function(collectionApi) {
        const tagSet = new Set();
        collectionApi.getAll().forEach(item => {
            (item.data.tags || []).forEach(tag => tagSet.add(tag.toLowerCase()));
        });

        const undesiredTags = new Set(["post", "posts", "all", "nav"]);
        const filteredTags = [...tagSet].filter(tag => !undesiredTags.has(tag));
        return filteredTags.sort();
    });

    // Shortcodes
    // ----------------------------------------------------------------
    
    // Shortcode para o ano atual (usado no copyright do rodapé)
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);


    // Configurações Finais
    // ----------------------------------------------------------------

    // Copiar assets
    eleventyConfig.addPassthroughCopy({ "public/": "/" });

    // Configuração de pastas
    return {
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "content",
            includes: "../_includes",
            data: "../_data",
            output: "_site"
        }
    };
};