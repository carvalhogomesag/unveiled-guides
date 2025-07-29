import slugify from "slugify";
import nestingToc from 'eleventy-plugin-nesting-toc';

export default function(eleventyConfig) {
    
    // PASSO 1: CONFIGURAR OS MOTORES DE TEMPLATE PRIMEIRO.
    // Isto é crucial para que os plugins saibam a que motor se ligar.
    eleventyConfig.setTemplateFormats(["md", "njk", "html"]);
    eleventyConfig.setLibrary("md", {
        // Opções para o processador de Markdown, se necessário no futuro
    });
    eleventyConfig.setNunjucksEnvironmentOptions({
        // Opções para o ambiente Nunjucks, se necessário no futuro
    });

    // PASSO 2: AGORA QUE O AMBIENTE ESTÁ PRONTO, ADICIONAR PLUGINS.
    eleventyConfig.addPlugin(nestingToc, {
        tags: ['h2', 'h3'],
        wrapper: 'div',
        wrapperClass: 'toc',
        headingText: 'On This Page',
        headingClass: 'toc-title'
    });

    // PASSO 3: ADICIONAR FILTROS, SHORTCODES E COLEÇÕES PERSONALIZADAS.
    eleventyConfig.addFilter("slugify", function(str) {
        return slugify(str, {
            lower: true,
            strict: true,
            remove: /["]/g,
        });
    });

    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
    });

    // PASSO 4: COPIAR ASSETS ESTÁTICOS.
    eleventyConfig.addPassthroughCopy({ "public/": "/" });

    // PASSO 5: RETORNAR A CONFIGURAÇÃO FINAL DAS PASTAS.
    return {
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