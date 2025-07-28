import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import slugify from "slugify";
import nestingToc from 'eleventy-plugin-nesting-toc';

export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "public/": "/" });
    
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight, { preAttributes: { tabindex: 0 } });
    eleventyConfig.addPlugin(pluginNavigation);
    eleventyConfig.addPlugin(nestingToc, { /* ... */ });

    eleventyConfig.addFilter("slugify", function(str) { /* ... */ });

    eleventyConfig.addCollection("post", function(collectionApi) { /* ... */ });

    return { /* ... */ };
};