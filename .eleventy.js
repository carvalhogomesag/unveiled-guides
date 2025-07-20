// Importa o plugin RSS
const pluginRss = require("@11ty/eleventy-plugin-rss");
// Importa o módulo URL do Node
const { URL } = require("url");
// Importa o pacote slugify
const slugify = require("slugify");

module.exports = function(eleventyConfig) {
  
  // --- PLUGINS ---
  eleventyConfig.addPlugin(pluginRss);

  // --- PASSTHROUGH (A CORREÇÃO FINAL) ---
  // Copia o CONTEÚDO da pasta 'public' para a raiz ('/') do site final.
  eleventyConfig.addPassthroughCopy({ "public/": "/" });

  // --- FILTROS DE TEMPLATE ---
  eleventyConfig.addFilter("readableDate", dateObj => new Date(dateObj).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  eleventyConfig.addFilter('isoDate', (dateObj) => new Date(dateObj).toISOString());
  eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).toString());
  eleventyConfig.addFilter("url_encode", (str) => encodeURIComponent(str));
  eleventyConfig.addFilter("slugify", function(str) {
      return slugify(str, { lower: true, strict: true, remove: /["]/g });
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