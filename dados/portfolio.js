/* ─────────────────────────────────────────────────────────────────────────
   PORTFÓLIO DA AUPE
   Cada objeto é um projeto. Para cadastrar um trabalho real:
     1. Coloque a capa (WebP, ~2000px de largura) em assets/portfolio/
        e, se houver, as fotos extras e o vídeo (MP4 H.264, ver LEIA-ME.md).
     2. Copie um bloco abaixo, preencha e apague o campo "demonstrativo".
   Campos:
     id            identificador curto, sem espaços
     titulo        nome do projeto
     categoria     uma das categorias de config.js
     descricao     1 ou 2 frases sobre o projeto
     capa          imagem principal
     galeria       lista de imagens extras (opcional)
     video         MP4 para tocar na visualização ampliada (opcional)
     destaque      true = aparece em "Projetos em destaque"
     demonstrativo true = mostra o selo "Demonstrativo" (apague em projetos reais)
   ───────────────────────────────────────────────────────────────────────── */
window.PORTFOLIO = [
  {
    id: "set-de-filmagem",
    titulo: "Set de filmagem",
    categoria: "Audiovisual",
    descricao: "Exemplo de projeto audiovisual: câmera de cinema, luz colorida e direção de cena. Conteúdo ilustrativo.",
    capa: "assets/portfolio/set-de-filmagem.webp",
    galeria: [],
    video: "assets/portfolio/abertura-demo.mp4",
    destaque: true,
    demonstrativo: true,
  },
  {
    id: "retrato-em-estudio",
    titulo: "Retrato em estúdio",
    categoria: "Fotografia",
    descricao: "Exemplo de retrato com luz de recorte e fundo escuro. Conteúdo ilustrativo.",
    capa: "assets/portfolio/retrato-em-estudio.webp",
    galeria: [],
    video: "",
    destaque: true,
    demonstrativo: true,
  },
  {
    id: "still-de-produto",
    titulo: "Still de produto",
    categoria: "Publicidade",
    descricao: "Exemplo de foto publicitária de produto com gelatinas coloridas. Conteúdo ilustrativo.",
    capa: "assets/portfolio/still-de-produto.webp",
    galeria: [],
    video: "",
    destaque: true,
    demonstrativo: true,
  },
  {
    id: "palco-e-publico",
    titulo: "Palco e público",
    categoria: "Eventos",
    descricao: "Exemplo de cobertura de evento sob luz de show. Conteúdo ilustrativo.",
    capa: "assets/portfolio/palco-e-publico.webp",
    galeria: [],
    video: "",
    destaque: false,
    demonstrativo: true,
  },
  {
    id: "rastros-de-luz",
    titulo: "Rastros de luz",
    categoria: "Projetos autorais",
    descricao: "Exemplo de ensaio autoral noturno em longa exposição. Conteúdo ilustrativo.",
    capa: "assets/portfolio/rastros-de-luz.webp",
    galeria: [],
    video: "",
    destaque: false,
    demonstrativo: true,
  },
  {
    id: "ensaio-ao-entardecer",
    titulo: "Ensaio ao entardecer",
    categoria: "Fotografia",
    descricao: "Exemplo de ensaio externo com luz de fim de tarde. Conteúdo ilustrativo.",
    capa: "assets/portfolio/ensaio-ao-entardecer.webp",
    galeria: [],
    video: "",
    destaque: false,
    demonstrativo: true,
  },
];
