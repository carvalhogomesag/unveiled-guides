const slugify = require("slugify");
const nestingToc = require('eleventy-plugin-nesting-toc');

module.exports = function(eleventyConfig) {
    
    // PASSTHROUGH
    eleventyConfig.addPassthroughCopy({ "public/": "/" });
    
    // PLUGINS
    eleventyConfig.addPlugin(nestingToc, {
        tags: ['h2', 'h3'],
        wrapper: 'div',
        wrapperClass: 'toc',
        headingText: 'On This Page',
        headingClass: 'toc-title'
    });

    // FILTROS
    eleventyConfig.addFilter("slugify", str => slugify(str, { lower: true, strict: true }));

    // COLEÇÕES
    eleventyConfig.addCollection("post", collectionApi => {
        return collectionApi.getFilteredByGlob("./content/posts/**/*.md").sort((a, b) => b.date - a.date);
    });

    // CONFIGURAÇÃO
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