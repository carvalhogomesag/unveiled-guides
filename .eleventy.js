// Importa o plugin RSS que nos dá os filtros de data
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Registar o plugin com o Eleventy
  eleventyConfig.addPlugin(pluginRss);

  // Pass through (copy) de ficheiros estáticos para o site final
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images"); // <-- ESTA É A LINHA QUE ESTAVA A FALTAR

  // Adiciona os filtros de data para os templates
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  eleventyConfig.addFilter('isoDate', (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  // Retorna o objeto de configuração principal
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};