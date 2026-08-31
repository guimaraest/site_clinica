console.log(process.env.NODE_ENV);
const config = require("./config.js");
const imageModule = import("@11ty/eleventy-img");
const buildPre = require("./build_pre.js");
const buildPost = require("./build_post.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.on("eleventy.before", async () => {
    await buildPre();
  });

  eleventyConfig.on("eleventy.after", async () => {
    await buildPost();
  });

  eleventyConfig.addLiquidShortcode("image", async function (source, alt, sizes = config.IMAGE_DEFAULT_SIZES, className = "") {
    const { default: Image, generateHTML } = await imageModule;
    const metadata = await Image(source, {
      widths: config.IMAGE_WIDTHS,
      formats: config.IMAGE_FORMATS,
      outputDir: config.IMAGE_OUTPUT_DIR,
      urlPath: config.IMAGE_URL_PATH,
      sharpOptions: { quality: config.WEBP_QUALITY }
    });
    return generateHTML(metadata, {
      alt,
      sizes,
      loading: config.IMAGE_LOADING,
      decoding: config.IMAGE_DECODING,
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
    pathPrefix: config.PATH_PREFIX
  };
};