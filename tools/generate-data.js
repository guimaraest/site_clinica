const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "src");
const dataDir = path.join(sourceDir, "_data");
const clinic = JSON.parse(fs.readFileSync(path.join(dataDir, "clinic.json"), "utf8"));

const labels = {
  "/": "home",
  "/servicos/": "serviços",
  "/localizacao/": "localização",
  "/equipe/": "nossa equipe"
};

function sourceRoutes(directory, relativeDirectory = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    const relativePath = path.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      if (["_data", "_includes", "assets"].includes(entry.name)) return [];
      return sourceRoutes(file, relativePath);
    }

    if (!entry.isFile() || path.extname(entry.name) !== ".liquid") return [];
    if (relativePath === "sitemap.liquid") return [];

    const withoutExtension = relativePath.slice(0, -".liquid".length);
    if (withoutExtension === "index") return ["/"];
    if (withoutExtension.endsWith("/index")) return [`/${withoutExtension.slice(0, -"/index".length)}/`];
    if (!withoutExtension.includes(path.sep)) return [`/${withoutExtension}/`];
    return [];
  });
}

module.exports = function generateData() {
  const routes = [...new Set(sourceRoutes(sourceDir))];
  const highLevelRoutes = routes
    .filter((route) => route === "/" || route.split("/").filter(Boolean).length === 1)
    .filter((route) => labels[route]);

  const nav = {
    nav: highLevelRoutes.map((url) => ({ title: labels[url], url })),
    button: { title: "WhatsApp", url: clinic.contact.whatsapp }
  };

  const footer = {
    brand: { name: clinic.name },
    contact: {
      email: clinic.contact.email,
      address: clinic.location.address
    },
    social: [
      {
        name: "WhatsApp",
        icon: "iconoir-whatsapp",
        url: clinic.contact.whatsapp
      },
      {
        name: "Instagram",
        icon: "iconoir-instagram",
        handle: clinic.social.instagram.handle,
        url: clinic.social.instagram.url
      },
      {
        name: "E-mail",
        icon: "iconoir-mail",
        url: `mailto:${clinic.contact.email}`
      }
    ],
    copyright: clinic.copyright
  };

  fs.writeFileSync(path.join(dataDir, "nav.json"), `${JSON.stringify(nav, null, 2)}\n`);
  fs.writeFileSync(path.join(dataDir, "footer.json"), `${JSON.stringify(footer, null, 2)}\n`);
};
