const path = require("path");

const ROOT_DIR = __dirname;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  ROOT_DIR,
  SOURCE_ASSETS_DIR: path.join(ROOT_DIR, "src", "assets"),
  OUTPUT_SITE_DIR: path.join(ROOT_DIR, "_site"),
  OUTPUT_ASSETS_DIR: path.join(ROOT_DIR, "_site", "assets"),
  SOURCE_CSS_DIR: path.join(ROOT_DIR, "src", "assets", "css"),
  SOURCE_PAGE_CSS_DIR: path.join(ROOT_DIR, "src", "assets", "css", "page"),
  SOURCE_JS_FILE: path.join(ROOT_DIR, "src", "assets", "main.js"),
  OUTPUT_CSS_DIR: path.join(ROOT_DIR, "_site", "assets", "css"),
  OUTPUT_IMAGE_DIR: path.join(ROOT_DIR, "_site", "assets", "images"),
  OUTPUT_JS_FILE: path.join(ROOT_DIR, "_site", "assets", "main.js"),
  ASSET_URL_PATH: "/assets/",
  GLOBAL_CSS_FILES: ["base.css", "components.css", "header.css", "footer.css"],
  GLOBAL_CSS_FILE: "global.css",
  CSS_EXTENSION: ".css",
  JS_EXTENSION: ".js",
  CSS_JS_EXTENSIONS: [".css", ".js"],
  IMAGE_WIDTHS: [320, 640, 960, 1280, 1600],
  IMAGE_FORMATS: ["webp"],
  WEBP_QUALITY: 90,
  IMAGE_URL_PATH: "/assets/images/",
  IMAGE_OUTPUT_DIR: "_site/assets/images/",
  IMAGE_DEFAULT_SIZES: "100vw",
  IMAGE_LOADING: "lazy",
  IMAGE_DECODING: "async",
  NEWLINE: "\n",
  HASH_ALGORITHM: "sha256",
  HASH_LENGTH: 8,
  PRODUCTION_PATH_PREFIX: "/site_clinica/",
  DEVELOPMENT_PATH_PREFIX: "/",
  PATH_PREFIX: IS_PRODUCTION ? "/site_clinica/" : "/",
  CRITTERS_OPTIONS: {
    path: path.join(ROOT_DIR, "_site"),
    publicPath: IS_PRODUCTION ? "/site_clinica/" : "/",
    inlineFonts: false,
    preload: "swap",
    pruneSource: false
  },
  HTML_MINIFY_OPTIONS: {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
  },
  CSS_LOADER: "css",
  JS_LOADER: "js",
  UTF8: "utf8",
  MINIFY: true
};
