// Importa o plugin RSS que nos dá os filtros de data
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Registar o plugin com o Eleventy
  eleventyConfig.addPlugin(pluginRss);

  // Pass through (copy) de ficheiros estáticos (a nossa pasta CSS)
    eleventyConfig.addPassthroughCopy("./css/");

  // Adiciona os filtros de data que estávamos a usar no index.njk
  eleventyConfig.addFilter("readableDate", dateObj => {
    // Usar o locale 'en-GB' para o formato Dia/Mês/Ano se preferir, ou 'en-US' para Mês/Dia/Ano
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
    // ---- AQUI ESTÁ A CORREÇÃO CRUCIAL ----
    // Diz ao Eleventy para primeiro processar o Markdown e depois o Nunjucks nos ficheiros .md
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};