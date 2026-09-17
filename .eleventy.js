console.log(process.env.NODE_ENV);
const config = require("./scripts/config.js");
const imageModule = import("@11ty/eleventy-img");
const buildPre = require("./scripts/build_pre.js");
const buildPost = require("./scripts/build_post.js");
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("development", IS_DEVELOPMENT);

  if (IS_DEVELOPMENT) {
    eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
    eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
    eleventyConfig.addPassthroughCopy({ "src/assets/main.js": "assets/main.js" });
  } else {
    eleventyConfig.on("eleventy.before", async () => {
      await buildPre();
    });

    eleventyConfig.on("eleventy.after", async () => {
      await buildPost();
    });
  }

  async function renderImage(source, alt, sizes, className, loading, fetchpriority) {
    if (IS_DEVELOPMENT) {
      const imageUrl = encodeURI(source.replace(/^src\/assets\//, "/assets/"));
      const priority = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
      const classAttribute = className ? ` class="${className}"` : "";
      return `<img src="${imageUrl}" alt="${alt}" sizes="${sizes}" loading="${loading}" decoding="${config.IMAGE_DECODING}"${priority}${classAttribute}>`;
    }

    const { default: Image, generateHTML } = await imageModule;
    const metadata = await Image(source, {
      widths: config.IMAGE_WIDTHS,
      formats: config.IMAGE_FORMATS,
      outputDir: config.IMAGE_GENERATED_DIR,
      urlPath: config.IMAGE_URL_PATH,
      sharpOptions: { quality: config.WEBP_QUALITY }
    });
    return generateHTML(metadata, {
      alt,
      sizes,
      loading,
      decoding: config.IMAGE_DECODING,
      ...(fetchpriority ? { fetchpriority } : {}),
      class: className
    });
  }

  eleventyConfig.addPassthroughCopy({ "src/assets/images/schema/fachada.jpg": "assets/images/schema/fachada.jpg" });
  
  eleventyConfig.addLiquidShortcode("image", function (source, alt, sizes = config.IMAGE_DEFAULT_SIZES, className = "") {
    return renderImage(source, alt, sizes, className, config.IMAGE_LOADING, "");
  });

  eleventyConfig.addLiquidShortcode("imageHigh", function (source, alt, sizes = config.IMAGE_DEFAULT_SIZES, className = "") {
    return renderImage(source, alt, sizes, className, "eager", "high");
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