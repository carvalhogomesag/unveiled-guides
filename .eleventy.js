// Importa o plugin RSS que nos dá filtros de data
const pluginRss = require("@11ty/eleventy-plugin-rss");

// Importa o módulo URL do Node para o filtro de URL absoluto
const { URL } = require("url");

module.exports = function(eleventyConfig) {
  
  // --- PLUGINS ---
  eleventyConfig.addPlugin(pluginRss);

  // --- PASSTHROUGH (Copiar ficheiros/pastas para o site final) ---
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("js");
  
  // Copia os ficheiros de favicon da raiz para o output
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("favicon.svg");


  // --- FILTROS DE TEMPLATE ---

  // Filtro para formatar datas num formato legível (ex: July 20, 2024)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  // Filtro para formatar datas no padrão ISO (para o atributo <time datetime="">)
  eleventyConfig.addFilter('isoDate', (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  // Filtro para criar URLs absolutos, necessário para os botões de partilha
  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    try {
        return (new URL(url, base)).toString();
    } catch(e) {
        console.error("Could not resolve absolute url: ", e);
        return url;
    }
  });


  // --- CONFIGURAÇÃO PRINCIPAL DO ELEVENTY ---
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