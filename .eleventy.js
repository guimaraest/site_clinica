console.log(process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
const buildAssets = require("./build.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    await buildAssets();
  });

  eleventyConfig.addTransform("optimizedImageUrls", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(
      /\/assets\/images\/([^"')?]+)\.(avif|bmp|gif|jpe?g|png|tiff?)\b/gi,
      "/assets/images/$1.webp"
    );
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