// Importa os plugins do template base (sintaxe ES Module)
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";

// Importa os NOSSOS plugins e módulos (sintaxe ES Module)
import { URL } from "url";
import slugify from "slugify";
import nestingToc from 'eleventy-plugin-nesting-toc';

// Importa os filtros do template base
import * as filters from "./_includes/filters.js";

export default function(eleventyConfig) {
    
    // --- PASSTHROUGH (Cópia de Assets) ---
    eleventyConfig.addPassthroughCopy({ "public/": "/" });
    
    // --- PLUGINS ---
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight, { preAttributes: { tabindex: 0 } });
    eleventyConfig.addPlugin(pluginNavigation);
    eleventyConfig.addPlugin(nestingToc, {
        tags: ['h2', 'h3'],
        wrapper: 'div',
        wrapperClass: 'toc',
        headingText: 'On This Page',
        headingClass: 'toc-title'
    });

    // --- FILTROS DE TEMPLATE ---
    // Adiciona os filtros do template base
    Object.keys(filters).forEach(filterName => {
        eleventyConfig.addFilter(filterName, filters[filterName]);
    });
    
    // Adiciona os NOSSOS filtros personalizados
    eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).toString());
    
    // ** AQUI ESTÁ A CORREÇÃO **
    // Readiciona o filtro url_encode que estava em falta
    eleventyConfig.addFilter("url_encode", (str) => {
        return encodeURIComponent(str);
    });

    // --- COLEÇÕES ---
    // Deixa o Eleventy criar a coleção "post" automaticamente a partir da tag,
    // que é o método padrão do template base.
    // Garanta que os seus artigos em `content/posts/` têm a tag `post`.

    // --- CONFIGURAÇÃO PRINCIPAL DO ELEVENTY ---
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