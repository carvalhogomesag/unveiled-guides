import slugify from "slugify";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

export default function(eleventyConfig) {

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

    // FILTROS ESPECÍFICOS PARA NUNJUCKS - ESTA É A CORREÇÃO CRÍTICA
    // Usar addNunjucksFilter garante que o filtro é registado no motor correto.
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
    
    // Aplicamos a mesma lógica ao filtro slugify por consistência e robustez.
    eleventyConfig.addNunjucksFilter("slugify", (str) => {
        return slugify(str, { lower: true, strict: true, remove: /["]/g });
    });

    // Coleção de posts
    eleventyConfig.addCollection("post", (collectionApi) => {
        return collectionApi.getFilteredByTag("post").sort((a, b) => new Date(b.date) - new Date(a.date));
    });

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