/* ─────────────────────────────────────────────────────────────────────────
   Configuração do site AUPE. Edite aqui contatos, formulário e frames.
   ───────────────────────────────────────────────────────────────────────── */
window.SITE = {
  nome: "AUPE — Fotografia & Audiovisual",

  // true = mostra os avisos "demonstrativo" / "em validação".
  // Troque para false quando o portfólio e os serviços forem reais e confirmados.
  modoDemonstracao: true,

  whatsapp: {
    numero: "5551997250514", // só dígitos: DDI + DDD + número
    mensagem: "Olá! Conheci a AUPE pelo site e gostaria de solicitar um orçamento para um projeto de fotografia ou audiovisual.",
  },

  contato: {
    // Destino do formulário (FormSubmit). Depois da ativação, o FormSubmit envia um
    // código aleatório: cole-o aqui no lugar do e-mail para não expor o endereço no código.
    email: "aupe.audiovisual@gmail.com",
    // Alternativa: chave pública do Web3Forms (https://web3forms.com). Se preenchida, é usada no lugar do FormSubmit.
    web3formsChave: "",
    assunto: "Novo pedido de orçamento pelo site AUPE",
  },

  // Categorias do filtro do portfólio (confirmar com a AUPE antes de publicar).
  categorias: ["Fotografia", "Audiovisual", "Publicidade", "Eventos", "Projetos autorais"],

  frames: {
    total: 160, // valor impresso pelo fatiar_frames.sh
    desktop: "assets/frames/desktop/f_{n}.webp",
    mobile: "assets/frames/mobile/f_{n}.webp",
  },
};
