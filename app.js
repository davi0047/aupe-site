/* ═════════════════════════════════════════════════════════════════════════
   AUPE — comportamento do site
   1. Abertura: a rolagem conduz o vídeo (frames num <canvas>)
   2. Parallax leve, topo, barra de progresso, revelar ao rolar
   3. Menu do celular
   4. Portfólio (dados/portfolio.js): filtros, destaques e visualização ampliada
   5. WhatsApp e botões "Solicitar orçamento" dos serviços
   6. Formulário → e-mail (FormSubmit ou Web3Forms, ver config.js)
   ═════════════════════════════════════════════════════════════════════════ */
(() => {
  const S = window.SITE || {};
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const celular = matchMedia("(max-width: 760px)").matches;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  if (S.modoDemonstracao) document.body.classList.add("demo");

  /* ── 1. Rolagem que toca o vídeo ──────────────────────────────────────── */
  const cine = $(".cine");
  const canvas = cine && $(".cine-canvas", cine);
  if (cine && canvas && S.frames && S.frames.total) {
    const ctx = canvas.getContext("2d");
    const total = S.frames.total;
    const padrao = celular ? S.frames.mobile : S.frames.desktop;
    const src = (i) => padrao.replace("{n}", String(i + 1).padStart(4, "0"));
    const quadros = new Array(total);
    const momentos = $$(".momento", cine);
    let alvo = 0, atual = 0, desenhado = -1;

    const carregar = (i) => {
      if (quadros[i]) return quadros[i];
      const img = new Image();
      img.decoding = "async";
      img.src = src(i);
      img.onload = () => { if (Math.round(atual) === i || desenhado === -1) desenhar(i, true); };
      return (quadros[i] = img);
    };

    // Carrega em passadas (1 a cada 8, depois 1 a cada 4…) para cobrir o filme inteiro cedo
    carregar(0);
    if (!reduzir) {
      const fila = [];
      for (const passo of [8, 4, 2, 1]) for (let i = 0; i < total; i += passo) if (!fila.includes(i)) fila.push(i);
      let k = 0;
      const lote = () => { for (let n = 0; n < 6 && k < fila.length; n++) carregar(fila[k++]); if (k < fila.length) setTimeout(lote, 40); };
      lote();
    }

    const pronto = (i) => quadros[i] && quadros[i].complete && quadros[i].naturalWidth;
    const maisProximo = (i) => {
      for (let d = 0; d < total; d++) {
        if (pronto(i - d)) return i - d;
        if (pronto(i + d)) return i + d;
      }
      return -1;
    };

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      desenhado = -1;
      desenhar(Math.round(atual), true);
    };

    function desenhar(i, forcar) {
      const j = maisProximo(i);
      if (j < 0 || (j === desenhado && !forcar)) return;
      const img = quadros[j];
      const cw = canvas.width, ch = canvas.height;
      const escala = Math.max(cw / img.naturalWidth, ch / img.naturalHeight); // "cover"
      const w = img.naturalWidth * escala, h = img.naturalHeight * escala;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      desenhado = j;
    }

    const progresso = () => {
      const r = cine.getBoundingClientRect();
      const curso = cine.offsetHeight - innerHeight;
      return Math.min(1, Math.max(0, -r.top / (curso || 1)));
    };

    const atualizarMomentos = (p) => {
      for (const m of momentos) {
        const de = parseFloat(m.dataset.de || 0), ate = parseFloat(m.dataset.ate || 1);
        m.classList.toggle("ativo", p >= de && (p < ate || (ate >= 1 && p >= 1)));
      }
      cine.classList.toggle("andou", p > 0.02);
    };

    const quadro = () => {
      alvo = progresso() * (total - 1);
      atual += (alvo - atual) * 0.18; // suaviza: sensação de filme, não de slide
      if (Math.abs(alvo - atual) < 0.05) atual = alvo;
      desenhar(Math.round(atual));
      atualizarMomentos(atual / (total - 1));
      requestAnimationFrame(quadro);
    };

    addEventListener("resize", ajustar);
    ajustar();
    if (reduzir) atualizarMomentos(0);
    else requestAnimationFrame(quadro);
  }

  /* ── 2. Parallax, topo, progresso, revelar ────────────────────────────── */
  const artes = reduzir ? [] : $$(".arte");
  const mover = () => {
    for (const a of artes) {
      const r = a.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      a.style.transform = `translate3d(0, ${(c * -60).toFixed(1)}px, 0) scale(1.08)`;
    }
  };

  const topo = $(".topo");
  const barra = $(".progresso");
  const whats = $(".whats");
  const formEl = $(".form");
  let formNaTela = false; // no celular o botão flutuante se recolhe para não cobrir o "Enviar"
  const aoRolar = () => {
    topo && topo.classList.toggle("rolou", scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    barra && barra.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
    whats && whats.classList.toggle("recolhido", celular && formNaTela);
    if (artes.length) requestAnimationFrame(mover);
  };
  if (formEl) new IntersectionObserver(([e]) => { formNaTela = e.isIntersecting; aoRolar(); }, { rootMargin: "0px 0px -35% 0px" }).observe($("button[type=submit]", formEl));
  addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  const observarRevelar = (raiz = document) => $$(".revelar:not(.visto)", raiz).forEach((x) => io.observe(x));
  observarRevelar();
  $$("[data-ano]").forEach((x) => (x.textContent = new Date().getFullYear()));

  /* ── 3. Menu do celular ───────────────────────────────────────────────── */
  const menuBotao = $(".menu-botao"), menu = $("#menu");
  if (menuBotao && menu) {
    const alternar = (abrir) => {
      menu.classList.toggle("aberto", abrir);
      menuBotao.setAttribute("aria-expanded", abrir);
      menuBotao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = abrir ? "hidden" : "";
    };
    menuBotao.addEventListener("click", () => alternar(menuBotao.getAttribute("aria-expanded") !== "true"));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => alternar(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("aberto")) alternar(false); });
  }

  /* ── 4. Portfólio ─────────────────────────────────────────────────────── */
  const itens = Array.isArray(window.PORTFOLIO) ? window.PORTFOLIO : [];
  const galeria = $(".galeria");
  const filtros = $(".filtros");
  const lb = $(".lightbox");
  let lista = itens, pos = 0;

  const imagem = (srcImg, alt, lazy = true) => {
    const i = el("img"); i.src = srcImg; i.alt = alt || ""; if (lazy) i.loading = "lazy"; i.decoding = "async"; return i;
  };

  const abrir = (item, colecao) => {
    if (!lb) return;
    lista = colecao; pos = colecao.indexOf(item);
    mostrar();
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  };
  const mostrar = () => {
    const it = lista[pos];
    const midia = $(".lb-midia", lb);
    midia.replaceChildren();
    if (it.video) {
      const v = el("video");
      v.src = it.video; v.poster = it.capa; v.controls = true; v.playsInline = true; v.preload = "metadata";
      if (!reduzir) { v.autoplay = true; v.muted = true; v.loop = true; }
      midia.append(v);
    } else {
      midia.append(imagem(it.capa, it.titulo, false));
    }
    $(".lb-cat", lb).textContent = it.categoria + (it.demonstrativo && S.modoDemonstracao ? " · Demonstrativo" : "");
    $(".lb-titulo", lb).textContent = it.titulo;
    $(".lb-desc", lb).textContent = it.descricao || "";
    const varios = lista.length > 1;
    $$(".lb-nav", lb).forEach((b) => (b.hidden = !varios));
  };
  if (lb) {
    const fechar = () => { const v = $("video", lb); if (v) v.pause(); lb.close ? lb.close() : lb.removeAttribute("open"); };
    $(".lb-fechar", lb).addEventListener("click", fechar);
    $(".lb-ant", lb).addEventListener("click", () => { pos = (pos - 1 + lista.length) % lista.length; mostrar(); });
    $(".lb-prox", lb).addEventListener("click", () => { pos = (pos + 1) % lista.length; mostrar(); });
    lb.addEventListener("click", (e) => { if (e.target === lb) fechar(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") $(".lb-ant", lb).click();
      if (e.key === "ArrowRight") $(".lb-prox", lb).click();
    });
    lb.addEventListener("close", () => { const v = $("video", lb); if (v) v.pause(); });
  }

  const cartao = (it, colecao) => {
    const b = el("button", "obra revelar");
    b.type = "button";
    b.dataset.categoria = it.categoria;
    b.setAttribute("aria-label", `${it.titulo} — ${it.categoria}. Ver ampliado`);
    b.append(imagem(it.capa, ""));
    if (it.demonstrativo && S.modoDemonstracao) b.append(el("span", "selo", "Demonstrativo"));
    if (it.video) b.append(el("span", "obra-play"));
    const info = el("span", "obra-info");
    info.append(el("span", "obra-cat", it.categoria), el("span", "obra-titulo", it.titulo));
    b.append(info);
    b.addEventListener("click", () => abrir(it, colecao()));
    return b;
  };

  if (galeria && itens.length) {
    let ativo = "Todos";
    const visiveis = () => (ativo === "Todos" ? itens : itens.filter((i) => i.categoria === ativo));
    itens.forEach((it) => galeria.append(cartao(it, visiveis)));

    if (filtros) {
      const cats = ["Todos", ...(S.categorias || [...new Set(itens.map((i) => i.categoria))])];
      cats.forEach((c) => {
        const f = el("button", "filtro", c);
        f.type = "button";
        f.setAttribute("aria-pressed", c === ativo);
        f.addEventListener("click", () => {
          ativo = c;
          $$(".filtro", filtros).forEach((x) => x.setAttribute("aria-pressed", x === f));
          $$(".obra", galeria).forEach((o) => o.classList.toggle("oculta", c !== "Todos" && o.dataset.categoria !== c));
          observarRevelar(galeria);
        });
        filtros.append(f);
      });
    }
    observarRevelar(galeria);
  }

  const destaques = $(".destaques");
  if (destaques) {
    const lista_d = itens.filter((i) => i.destaque);
    lista_d.forEach((it, n) => {
      const art = el("article", "projeto revelar");
      const capa = el("button", "projeto-capa");
      capa.type = "button";
      capa.setAttribute("aria-label", `Ver ${it.titulo} ampliado`);
      capa.append(imagem(it.capa, ""));
      if (it.demonstrativo && S.modoDemonstracao) capa.append(el("span", "selo", "Demonstrativo"));
      if (it.video) capa.append(el("span", "obra-play"));
      capa.addEventListener("click", () => abrir(it, lista_d));
      const p = el("div", "painel");
      p.append(el("div", "projeto-num", String(n + 1).padStart(2, "0")), el("span", "obra-cat", it.categoria), el("h3", "", it.titulo), el("p", "", it.descricao || ""));
      const ver = el("button", "botao botao--linha", it.video ? "Assistir" : "Ver projeto");
      ver.type = "button";
      ver.addEventListener("click", () => abrir(it, lista_d));
      p.append(ver);
      art.append(capa, p);
      destaques.append(art);
    });
    if (!lista_d.length) destaques.closest("section").hidden = true;
    observarRevelar(destaques);
  }

  /* ── 5. WhatsApp e orçamento por serviço ──────────────────────────────── */
  if (S.whatsapp) {
    const num = String(S.whatsapp.numero || "").replace(/\D/g, "");
    const link = `https://wa.me/${num}?text=${encodeURIComponent(S.whatsapp.mensagem || "")}`;
    $$("[data-whats]").forEach((a) => { a.href = link; a.target = "_blank"; a.rel = "noopener"; });
  }
  const selServico = $("#f-servico");
  $$("[data-servico]").forEach((b) => b.addEventListener("click", () => {
    if (selServico) selServico.value = b.dataset.servico;
    $("#contato").scrollIntoView({ behavior: reduzir ? "auto" : "smooth" });
    setTimeout(() => $("#f-nome") && $("#f-nome").focus({ preventScroll: true }), reduzir ? 0 : 700);
  }));
  const data = $("#f-data");
  if (data) data.min = new Date().toISOString().slice(0, 10);

  /* ── 6. Formulário → e-mail ───────────────────────────────────────────── */
  if (formEl && S.contato) {
    const status = $(".form-status", formEl);
    const botao = $("button[type=submit]", formEl);
    const avisar = (txt, tipo) => { status.textContent = txt; status.className = `form-status campo--inteiro ${tipo || ""}`; };
    const valido = (c) => {
      if (c.type === "checkbox") return c.checked;
      if (c.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value.trim());
      if (c.type === "tel") return c.value.replace(/\D/g, "").length >= 10;
      return c.value.trim().length > 1;
    };
    $$("[required]", formEl).forEach((c) => c.addEventListener("input", () => { if (valido(c)) c.closest(".campo").classList.remove("erro"); }));

    formEl.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (formEl.elements._honey.value) return; // robô
      let ok = true, primeiro = null;
      $$("[required]", formEl).forEach((c) => {
        const v = valido(c);
        c.closest(".campo").classList.toggle("erro", !v);
        c.setAttribute("aria-invalid", !v);
        if (!v) { ok = false; primeiro = primeiro || c; }
      });
      if (!ok) { primeiro.focus(); return avisar("Confira os campos destacados.", "falha"); }

      const dados = Object.fromEntries(new FormData(formEl));
      delete dados._honey;
      dados.consentimento_lgpd = "Sim — " + new Date().toLocaleString("pt-BR");
      delete dados.consentimento;
      const assunto = S.contato.assunto || `Novo contato pelo site ${S.nome || ""}`;
      let url, corpo;
      if (S.contato.web3formsChave) {
        url = "https://api.web3forms.com/submit";
        corpo = { access_key: S.contato.web3formsChave, subject: assunto, from_name: S.nome, ...dados };
      } else {
        url = `https://formsubmit.co/ajax/${encodeURIComponent(S.contato.email)}`;
        corpo = { _subject: assunto, _template: "table", _captcha: "false", ...dados };
      }

      botao.disabled = true;
      avisar("Enviando…");
      const limite = new AbortController();
      const relogio = setTimeout(() => limite.abort(), 20000); // não deixa o "Enviando…" preso
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(corpo),
          signal: limite.signal,
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || r.status);
        formEl.reset();
        avisar("Pedido recebido! A AUPE vai responder pelo e-mail ou WhatsApp informado.", "ok");
      } catch (e) {
        console.warn("Falha no envio do formulário:", e);
        // Plano B: o pedido não se perde. Abre o WhatsApp com tudo que a pessoa preencheu.
        const texto = [
          "Olá, AUPE! Quero solicitar um orçamento.",
          `Nome: ${dados.nome || ""}`,
          `E-mail: ${dados.email || ""}`,
          `WhatsApp: ${dados.whatsapp || ""}`,
          dados.tipo_de_servico && `Serviço: ${dados.tipo_de_servico}`,
          dados.data_prevista && `Data prevista: ${dados.data_prevista.split("-").reverse().join("/")}`,
          dados.descricao && `Projeto: ${dados.descricao}`,
        ].filter(Boolean).join("\n");
        avisar("O envio por e-mail falhou agora. Mande o mesmo pedido pelo WhatsApp, já está escrito.", "falha");
        const link = document.createElement("a");
        link.href = `https://wa.me/${S.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
        link.target = "_blank"; link.rel = "noopener";
        link.className = "botao form-whats";
        link.textContent = "Enviar pelo WhatsApp";
        status.append(link);
      } finally {
        clearTimeout(relogio);
        botao.disabled = false;
      }
    });
  }
})();
