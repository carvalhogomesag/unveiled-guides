// Importa os plugins do template base (sintaxe ES Module)
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";

// Importa os NOSSOS plugins e módulos (sintaxe ES Module)
import { URL } from "url";
import slugify from "slugify";
import nestingToc from 'eleventy-plugin-nesting-toc';

// A linha 'import * as filters from "./_includes/filters.js";' foi REMOVIDA

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
    // A linha 'Object.keys(filters).forEach(...)' foi REMOVIDA
    
    // Adiciona os NOSSOS filtros personalizados
    eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).toString());
    eleventyConfig.addFilter("slugify", function(str) {
        return slugify(str, { lower: true, strict: true, remove: /["]/g });
    });
    eleventyConfig.addFilter("url_encode", (str) => {
        return encodeURIComponent(str);
    });

    // --- COLEÇÕES ---
    eleventyConfig.addCollection("post", function(collectionApi) {
        return collectionApi.getFilteredByGlob("./content/posts/**/*.md").sort((a, b) => b.date - a.date);
    });

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