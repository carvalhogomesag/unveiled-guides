// Importa o plugin RSS que nos dá filtros de data
const pluginRss = require("@11ty/eleventy-plugin-rss");

// Importa o módulo URL do Node para o filtro de URL absoluto
const { URL } = require("url");

// Importa o pacote slugify para criar URLs amigáveis a partir das tags
const slugify = require("slugify");

module.exports = function(eleventyConfig) {
  
  // --- PLUGINS ---
  // Adiciona funcionalidades extras, como filtros de data.
  eleventyConfig.addPlugin(pluginRss);

  // --- PASSTHROUGH (Copiar ficheiros/pastas para o site final) ---
  // Diz ao Eleventy para copiar o CONTEÚDO da pasta 'public' para a raiz do site final.
  // Esta é agora a nossa única regra para todos os assets (CSS, JS, Imagens, Favicons).
  eleventyConfig.addPassthroughCopy("public");


  // --- FILTROS DE TEMPLATE ---
  // Permitem-nos transformar dados nos nossos ficheiros de template.

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

  // Filtro para codificar strings para URLs, usado nos botões de partilha
  eleventyConfig.addFilter("url_encode", (str) => {
    return encodeURIComponent(str);
  });

  // Filtro para criar "slugs" a partir de strings (ex: "Travel Tips" -> "travel-tips")
  eleventyConfig.addFilter("slugify", function(str) {
      return slugify(str, {
          lower: true,
          strict: true,
          remove: /["]/g,
      });
  });

  // --- COLEÇÕES PERSONALIZADAS ---
  // Cria coleções de dados que podemos usar nos nossos templates.
  eleventyConfig.addCollection("navTags", function(collectionApi) {
      let tagSet = new Set();
      collectionApi.getAll().forEach(item => {
          if ("tags" in item.data) {
              let tags = item.data.tags;
              if (typeof tags === "string") { tags = [tags]; }
              
              // AQUI DEFINIMOS AS TAGS QUE APARECEM NO MENU PRINCIPAL
              const navTags = ["Lisbon", "Sintra", "History", "Palaces", "Travel Tips", "Family", "Boat Trips", "Architecture", "UNESCO"];
              
              tags.forEach(tag => {
                  if (navTags.includes(tag)) {
                      tagSet.add(tag);
                  }
              });
          }
      });
      // Retorna um array ordenado de tags para o menu
      return [...tagSet].sort((a, b) => a.localeCompare(b));
  });


  // --- CONFIGURAÇÃO PRINCIPAL DO ELEVENTY ---
  // Define as pastas de entrada, output, e os motores de template a usar.
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