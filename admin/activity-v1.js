(() => {
  const GH_BASE = "https://api.github.com/repos/soller-ara/soller-ara/contents/";
  let entries = [];

  const esc = (v) => String(v ?? "")
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
    if (!response.ok) throw new Error("No se ha podido cargar el registro de actividad.");
    return response.json();
  }

  function labelFor(action) {
    const labels = {
      "publish": "Publicada",
      "edit": "Editada",
      "delete-own": "Eliminada",
      "hide": "Ocultada",
      "unhide": "Restaurada",
      "source-enable": "Fuente activada",
      "source-disable": "Fuente desactivada",
    };
    return labels[action] || action || "Acción";
  }

  function areaFor(area) {
    if (area === "publications") return "Publicaciones";
    if (area === "moderation") return "Moderación";
    if (area === "sources") return "Fuentes";
    return area || "Sistema";
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "";
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date);
  }

  function inject() {
    const nav = document.querySelector(".admin-nav");
    const app = document.getElementById("adminView");
    if (!nav || !app || document.getElementById("activity")) return;

    const tab = document.createElement("button");
    tab.className = "nav-button";
    tab.type = "button";
    tab.dataset.view = "activity";
    tab.textContent = "Actividad";
    nav.appendChild(tab);

    const section = document.createElement("section");
    section.id = "activity";
    section.className = "module";
    section.innerHTML = `
      <div class="module-heading">
        <div>
          <p class="eyebrow">Historial</p>
          <h2>Registro de actividad</h2>
          <p class="hint">Historial de acciones realizadas desde Administración a partir de esta versión.</p>
        </div>
        <button id="refreshActivityButton" class="button-secondary" type="button">Actualizar</button>
      </div>
      <div id="activitySummary" class="metrics"></div>
      <article class="panel-card">
        <div class="module-heading" style="margin-bottom:12px">
          <h3>Actividad reciente</h3>
          <select id="activityFilter" class="search-input" aria-label="Filtrar actividad">
            <option value="all">Todas</option>
            <option value="publications">Publicaciones</option>
            <option value="moderation">Moderación</option>
            <option value="sources">Fuentes</option>
          </select>
        </div>
        <div id="activityList" class="post-list"><p class="empty">Cargando actividad…</p></div>
      </article>
      <p id="activityMessage" class="message" aria-live="polite"></p>`;
    app.appendChild(section);

    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-button").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".module").forEach((x) => x.classList.remove("active"));
      tab.classList.add("active");
      section.classList.add("active");
      load();
    });
    document.getElementById("refreshActivityButton").addEventListener("click", load);
    document.getElementById("activityFilter").addEventListener("change", render);
  }

  function renderSummary() {
    const today = new Date().toDateString();
    const todayCount = entries.filter((item) => new Date(item.timestamp).toDateString() === today).length;
    document.getElementById("activitySummary").innerHTML = [
      ["Acciones guardadas", entries.length],
      ["Hoy", todayCount],
      ["Capacidad", "250"]
    ].map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");
  }

  function render() {
    renderSummary();
    const filter = document.getElementById("activityFilter")?.value || "all";
    const visible = filter === "all" ? entries : entries.filter((item) => item.area === filter);
    const list = document.getElementById("activityList");
    if (!visible.length) {
      list.innerHTML = '<p class="empty">Todavía no hay acciones registradas en esta categoría.</p>';
      return;
    }
    list.innerHTML = visible.map((item) => `
      <article class="post-item">
        <header><h4>${esc(labelFor(item.action))}${item.title ? " · " + esc(item.title) : ""}</h4></header>
        <div class="post-meta">${esc(areaFor(item.area))} · ${esc(formatDate(item.timestamp))}</div>
        ${item.detail ? `<div class="post-meta">${esc(item.detail)}</div>` : ""}
      </article>`).join("");
  }

  async function load() {
    const button = document.getElementById("refreshActivityButton");
    const message = document.getElementById("activityMessage");
    if (button) { button.disabled = true; button.textContent = "Actualizando…"; }
    if (message) { message.textContent = ""; message.className = "message"; }
    try {
      const payload = await repoJson("data/activity_log.json");
      entries = Array.isArray(payload.entries) ? payload.entries : [];
      render();
    } catch (error) {
      if (message) { message.textContent = error.message; message.className = "message error"; }
    } finally {
      if (button) { button.disabled = false; button.textContent = "Actualizar"; }
    }
  }

  inject();
})();
