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

Antes da publicação, preencha os dados de contato, mapa, redes sociais e registros profissionais em `src/_data/` e remova todos os valores `SEU_`. O comando `npm test` gera o site e verifica esses requisitos.
