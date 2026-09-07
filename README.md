# site_clinica

Website da clínica odontológica Concept Belvedere, gerado com Eleventy.

## Desenvolvimento

```bash
npm install
npm run dev
```

O servidor de desenvolvimento usa `NODE_ENV=development`. Para gerar a versão de produção:

```bash
npm run build
```

Antes da publicação, preencha os dados de contato, mapa, redes sociais e endereço em `src/_data/clinic.json`. Os dados da equipe permanecem em `src/_data/equipe.json`. O comando `npm test` gera o site e verifica a estrutura dos links e elementos incorporados.
