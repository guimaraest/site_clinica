console.log(process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets"); // copy your static assets

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