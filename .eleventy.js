// Importa o plugin RSS que nos dá filtros de data
const pluginRss = require("@11ty/eleventy-plugin-rss");

// Importa o módulo URL do Node para o filtro de URL absoluto
const { URL } = require("url");

// Importa o pacote slugify para criar URLs amigáveis a partir das tags
const slugify = require("slugify");

module.exports = function(eleventyConfig) {
  
  // --- PLUGINS ---
  eleventyConfig.addPlugin(pluginRss);

  // --- PASSTHROUGH (Copiar ficheiros/pastas para o site final) ---
  // Copia as nossas pastas principais de assets.
  eleventyConfig.addPassthroughCopy("public/css");
  eleventyConfig.addPassthroughCopy("public/js");
  eleventyConfig.addPassthroughCopy("public/images");
  
  // ** AQUI ESTÁ A CORREÇÃO EXPLÍCITA E FINAL **
  // Copia cada ficheiro de favicon individualmente da pasta public para a raiz do site.
  eleventyConfig.addPassthroughCopy({ "public/apple-touch-icon.png": "/apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "public/favicon-16x16.png": "/favicon-16x16.png" });
  eleventyConfig.addPassthroughCopy({ "public/favicon-32x32.png": "/favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "public/favicon.ico": "/favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "public/favicon.svg": "/favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "public/site.webmanifest": "/site.webmanifest" });
  // Adicione aqui qualquer outro ficheiro de favicon que tenha na pasta public.


  // --- FILTROS DE TEMPLATE ---
  eleventyConfig.addFilter("readableDate", dateObj => new Date(dateObj).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  eleventyConfig.addFilter('isoDate', (dateObj) => new Date(dateObj).toISOString());
  eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).toString());
  eleventyConfig.addFilter("url_encode", (str) => encodeURIComponent(str));
  eleventyConfig.addFilter("slugify", function(str) {
      return slugify(str, {
          lower: true,
          strict: true,
          remove: /["]/g,
      });
  });

  // --- COLEÇÕES PERSONALIZADAS ---
  eleventyConfig.addCollection("navTags", function(collectionApi) {
      let tagSet = new Set();
      collectionApi.getAll().forEach(item => {
          if ("tags" in item.data) {
              let tags = item.data.tags;
              if (typeof tags === "string") { tags = [tags]; }
              const navTags = ["Lisbon", "Sintra", "History", "Palaces", "Travel Tips", "Family", "Boat Trips", "Architecture", "UNESCO"];
              tags.forEach(tag => {
                  if (navTags.includes(tag)) {
                      tagSet.add(tag);
                  }
              });
          }
      });
      return [...tagSet].sort((a, b) => a.localeCompare(b));
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