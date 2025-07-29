import slugify from "slugify";
import nestingToc from 'eleventy-plugin-nesting-toc';

// Usar "export default async function" é uma prática mais robusta para
// configurações do Eleventy com ES Modules.
export default async function(eleventyConfig) {
    
    // Copia os assets da pasta 'public' para a raiz do site.
    eleventyConfig.addPassthroughCopy({ "public/": "/" });
    
    // Adiciona o plugin para a Tabela de Conteúdos (Table of Contents).
    eleventyConfig.addPlugin(nestingToc, {
        tags: ['h2', 'h3'],
        wrapper: 'div',
        wrapperClass: 'toc',
        headingText: 'On This Page',
        headingClass: 'toc-title'
    });

    // Adiciona um filtro personalizado para criar "slugs" para as URLs das tags.
    eleventyConfig.addFilter("slugify", function(str) {
        return slugify(str, {
            lower: true,
      strict: true,
            remove: /["]/g,
    });
    });

    // Cria uma coleção "post" com todos os artigos, ordenados por data (do mais novo para o mais antigo).
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
    });

    // Define a estrutura de pastas do projeto para o Eleventy.
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