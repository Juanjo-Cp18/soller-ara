(() => {
  const repoJson = window.SOLLER_ARA_READ_JSON;
  let rendering = false;
  const categoryNames = {news: "Noticias", agenda: "Agenda", alerts: "Avisos", services: "Servicios", culture: "Cultura", sports: "Deportes", commerce: "Comercio"};
  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  async function findCard() {
    for (let attempt = 0; attempt < 50; attempt++) {
      const heading = [...document.querySelectorAll("#sources .panel-card h3")]
        .find((item) => item.textContent.includes("Distribución automática"));
      if (heading) return heading.closest(".panel-card");
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return null;
  }

  function row(title, detail, status, kind = "") {
    return `<div class="status-row"><span><strong>${esc(title)}</strong><small>${detail}</small></span><strong class="${kind}">${esc(status)}</strong></div>`;
  }

  function platformRow(config, entries, platform, logAvailable) {
    const name = platform === "facebook" ? "Facebook" : "Instagram";
    const enabled = config.platforms?.[platform] === true;
    const count = Object.values(config.sources || {}).filter((item) => item?.[platform] === true).length;
    let detail = `${count} fuentes configuradas` + (platform === "instagram" ? " · tarjetas propias de Sóller Ara" : "");
    let status = !enabled ? "DESACTIVADA" : config.enabled ? "PENDIENTE" : "PREPARADO";
    let kind = "pending";
    const last = entries.filter((item) => item.platform === platform && item.mode === "automatic_collected")
      .sort((a, b) => String(b.recorded_at).localeCompare(String(a.recorded_at)))[0];
    if (enabled && config.enabled && !logAvailable) {
      status = "SIN DATOS";
      detail += "<br>No se ha podido consultar el registro de envíos.";
    } else if (enabled && config.enabled && last) {
      const date = new Date(last.recorded_at);
      const when = Number.isNaN(date.getTime()) ? "" : date.toLocaleString("es-ES");
      if (last.status === "success") {
        status = "ENVIADO";
        kind = "ok";
        detail += `<br>Último envío confirmado: ${esc(when)}.`;
        if (last.title) detail += `<br>${esc(last.title)}`;
        try {
          const url = new URL(last.remote_url);
          if (url.protocol === "https:" && ["www.facebook.com", "www.instagram.com", "facebook.com", "instagram.com"].includes(url.hostname)) {
            detail += ` <a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Ver publicación</a>`;
          }
        } catch (_) {}
      } else {
        status = "ERROR";
        kind = "bad";
        detail += `<br>Último intento: ${esc(when)}. ${esc(last.error || "No se ha podido completar el envío.")}`;
      }
    } else if (enabled && config.enabled) {
      detail += "<br>A la espera del primer envío de contenido reciente.";
    }
    return row(name, detail, status, kind);
  }

  async function render() {
    if (rendering) return;
    rendering = true;
    try {
      const card = await findCard();
      if (!card) return;
      let target = document.getElementById("socialAutoStatus");
      if (!target) {
        target = document.createElement("div");
        target.id = "socialAutoStatus";
        target.setAttribute("aria-live", "polite");
        card.appendChild(target);
      }
      target.innerHTML = '<p class="empty">Cargando configuración…</p>';
      const [configResult, logResult] = await Promise.allSettled([
        repoJson("social_distribution.json"), repoJson("data/social_publish_log.json"),
      ]);
      if (configResult.status !== "fulfilled") {
        target.innerHTML = `<p class="message error">${esc(configResult.reason.message)}</p>`;
        return;
      }
      const config = configResult.value;
      const active = config.enabled === true;
      const entries = logResult.status === "fulfilled" ? logResult.value.entries || [] : [];
      const categories = Object.entries(config.categories || {}).filter(([, enabled]) => enabled === true)
        .map(([key]) => categoryNames[key] || key);
      target.innerHTML = `<div class="status-list">${
        row("Automatización", active ? "Revisión programada cada hora; los envíos se confirman debajo." : "La publicación automática está pausada.", active ? "ACTIVA" : "DESACTIVADA", active ? "ok" : "pending")
        + platformRow(config, entries, "facebook", logResult.status === "fulfilled")
        + platformRow(config, entries, "instagram", logResult.status === "fulfilled")
        + row("Ritmo máximo", `Contenido de las últimas ${esc(config.max_age_hours || 6)} h, sin repetir envíos confirmados.`, `${config.max_posts_per_run || 3} noticias / ejecución`)
      }</div><p class="hint">Categorías activas: ${esc(categories.join(", ") || "ninguna")}. Máximo una noticia por fuente en cada ejecución. Los medios externos se comparten con titular, atribución y enlace original; Instagram utiliza una tarjeta gráfica propia.</p>`;
    } finally {
      rendering = false;
    }
  }

  render();
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button?.dataset.view === "sources" || button?.id === "refreshSourcesButton") render();
  });
})();
