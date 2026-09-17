(() => {
  const GH_BASE = "https://api.github.com/repos/soller-ara/soller-ara/contents/";

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  async function repoJson(path) {
    const response = await fetch(GH_BASE + path + "?ref=main&v=" + Date.now(), {
      cache: "no-store",
      mode: "cors",
      headers: {
        "Accept": "application/vnd.github.raw+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!response.ok) throw new Error("GitHub " + response.status);
    return response.json();
  }

  async function findCard() {
    for (let attempt = 0; attempt < 50; attempt++) {
      const headings = [...document.querySelectorAll("#sources .panel-card h3")];
      const heading = headings.find((item) => item.textContent.includes("Distribución automática"));
      if (heading) return heading.closest(".panel-card");
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return null;
  }

  function enabledCount(config, platform) {
    return Object.values(config.sources || {}).filter((item) => item && item[platform] === true).length;
  }

  async function render() {
    const card = await findCard();
    if (!card) return;

    let target = document.getElementById("socialAutoStatus");
    if (!target) {
      target = document.createElement("div");
      target.id = "socialAutoStatus";
      card.appendChild(target);
    }

    target.innerHTML = '<p class="empty">Cargando configuración…</p>';
    try {
      const config = await repoJson("social_distribution.json");
      const active = config.enabled === true;
      const fb = config.platforms?.facebook === true;
      const ig = config.platforms?.instagram === true;
      const categories = Object.entries(config.categories || {})
        .filter(([, value]) => value === true)
        .map(([key]) => key);

      target.innerHTML = `
        <div class="status-list" style="margin-top:14px">
          <div class="status-row"><span><strong>Automatización</strong><small>${active ? "Publicación automática activa" : "Preparada, pendiente de activación final"}</small></span><strong class="${active ? "ok" : "pending"}">${active ? "ACTIVA" : "DESACTIVADA"}</strong></div>
          <div class="status-row"><span><strong>Facebook</strong><small>${enabledCount(config, "facebook")} fuentes configuradas</small></span><strong class="${fb ? "ok" : "pending"}">${fb ? "PREPARADO" : "OFF"}</strong></div>
          <div class="status-row"><span><strong>Instagram</strong><small>${enabledCount(config, "instagram")} fuentes configuradas · tarjetas propias de Sóller Ara</small></span><strong class="${ig ? "ok" : "pending"}">${ig ? "PREPARADO" : "OFF"}</strong></div>
          <div class="status-row"><span><strong>Ritmo máximo</strong><small>Solo contenido nuevo de las últimas ${esc(config.max_age_hours || 6)} h</small></span><strong>${esc(config.max_posts_per_run || 3)} / ejecución</strong></div>
        </div>
        <p class="hint" style="margin-top:12px">Categorías activas: ${esc(categories.join(", ") || "ninguna")}. Las publicaciones de medios externos usan titular, atribución y enlace original; Instagram utiliza una tarjeta gráfica propia.</p>
      `;
    } catch (error) {
      target.innerHTML = '<p class="message error">No se ha podido cargar la configuración social.</p>';
    }
  }

  render();
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".nav-button");
    if (button?.dataset.view === "sources") setTimeout(render, 100);
  });
})();
