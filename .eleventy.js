console.log(process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
const imageModule = import("@11ty/eleventy-img");
const buildPre = require("./build_pre.js");
const buildPost = require("./build_post.js");
const WEBP_QUALITY = 80;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.on("eleventy.before", async () => {
    await buildPre();
  });

  eleventyConfig.on("eleventy.after", async () => {
    await buildPost();
  });

  eleventyConfig.addLiquidShortcode("image", async function (source, alt, sizes = "100vw", className = "") {
    const { default: Image, generateHTML } = await imageModule;
    const metadata = await Image(source, {
      widths: [320, 640, 960, 1280, 1600],
      formats: ["webp"],
      outputDir: "_site/assets/images/",
      urlPath: "/assets/images/",
      sharpOptions: { quality: WEBP_QUALITY }
    });
    return generateHTML(metadata, {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      class: className
    });
  });

  eleventyConfig.addTransform("envComment", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return content + `\n<!-- env: ${process.env.NODE_ENV} -->`;
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    pathPrefix: isProd ? "/site_clinica/" : "/"
  };
};