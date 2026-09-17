(() => {
  const API = String(window.SOLLER_ARA_ADMIN_API || "").replace(/\/$/, "");
  const TOKEN_KEY = "sollerAraAdminSession";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");
    const token = sessionStorage.getItem(TOKEN_KEY) || "";
    if (token) headers.set("Authorization", "Bearer " + token);

    const response = await fetch(API + path, {
      ...options,
      headers,
      cache: "no-store",
      mode: "cors",
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(payload.error || "Error de Administración.");
    return payload;
  }

  function setMessage(text, kind = "") {
    const target = document.getElementById("sourcesMessage");
    if (!target) return;
    target.textContent = text || "";
    target.className = "message" + (kind ? " " + kind : "");
  }

  function injectModule() {
    const nav = document.querySelector(".admin-nav");
    const app = document.getElementById("adminView");
    if (!nav || !app || document.getElementById("sources")) return;

    const button = document.createElement("button");
    button.className = "nav-button";
    button.type = "button";
    button.dataset.view = "sources";
    button.textContent = "Fuentes";
    nav.appendChild(button);

    const section = document.createElement("section");
    section.id = "sources";
    section.className = "module";
    section.innerHTML = `
      <div class="module-heading">
        <div>
          <p class="eyebrow">Recopilación</p>
          <h2>Fuentes de Sóller Ara</h2>
          <p class="hint">Activa o desactiva las fuentes que alimentan automáticamente la web.</p>
        </div>
        <button id="refreshSourcesButton" class="button-secondary" type="button">Actualizar</button>
      </div>
      <div id="sourcesSummary" class="metrics"></div>
      <article class="panel-card">
        <h3>Fuentes de información</h3>
        <div id="sourcesList" class="post-list"><p class="empty">Cargando fuentes…</p></div>
      </article>
      <article class="panel-card" style="margin-top:18px">
        <h3>Fuentes sociales externas</h3>
        <p class="hint">Su estado se muestra aquí. La activación depende de las APIs de cada plataforma.</p>
        <div id="socialSourcesList" class="post-list"><p class="empty">Cargando…</p></div>
      </article>
      <article class="panel-card" style="margin-top:18px">
        <h3>Distribución automática a redes</h3>
        <p class="hint">Siguiente fase: decidir por fuente qué contenido se enviará automáticamente a Facebook e Instagram. Todavía no está activado.</p>
      </article>
      <p id="sourcesMessage" class="message" aria-live="polite"></p>
    `;
    app.appendChild(section);

    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-button").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".module").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      section.classList.add("active");
      loadSources();
    });

    document.getElementById("refreshSourcesButton").addEventListener("click", loadSources);
  }

  async function fetchJson(path) {
    const response = await fetch(path + "?v=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("No se ha podido cargar " + path);
    return response.json();
  }

  function sourceStatusMap(postsData) {
    const map = new Map();
    for (const item of (postsData.source_status || [])) {
      if (item.source_id) map.set(item.source_id, item);
    }
    return map;
  }

  function renderSummary(sources) {
    const active = sources.filter((item) => item.enabled !== false).length;
    const inactive = sources.length - active;
    document.getElementById("sourcesSummary").innerHTML = [
      ["Fuentes configuradas", sources.length],
      ["Activas", active],
      ["Desactivadas", inactive],
    ].map(([label, value]) => `
      <div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
    `).join("");
  }

  function typeLabel(item) {
    const type = item.source_type || "publisher";
    if (type === "official") return "Oficial";
    if (type === "media") return "Medio";
    if (type === "social") return "Social";
    return type;
  }

  function renderSources(config, postsData) {
    const sources = Array.isArray(config.sources) ? config.sources : [];
    const status = sourceStatusMap(postsData);
    renderSummary(sources);

    const target = document.getElementById("sourcesList");
    if (!sources.length) {
      target.innerHTML = '<p class="empty">No hay fuentes configuradas.</p>';
      return;
    }

    target.innerHTML = sources.map((source) => {
      const enabled = source.enabled !== false;
      const current = status.get(source.id);
      const health = !enabled ? "DESACTIVADA" : current?.ok === false ? "ERROR" : current?.ok === true ? "OK" : "PENDIENTE";
      const healthClass = !enabled ? "pending" : current?.ok === false ? "bad" : current?.ok === true ? "ok" : "pending";
      const count = current?.count ?? 0;
      return `
        <article class="post-item" data-source-card="${escapeHtml(source.id)}">
          <header><h4>${escapeHtml(source.name || source.id)}</h4></header>
          <div class="post-meta">
            ${escapeHtml(typeLabel(source))} · ${escapeHtml(source.type || "")} · ${escapeHtml(source.language || "")} · ${escapeHtml(count)} publicaciones
          </div>
          <div class="post-meta">${escapeHtml(source.locality || "Sóller")}</div>
          <div class="post-actions">
            <span class="${healthClass}">${health}</span>
            <button type="button" data-source-id="${escapeHtml(source.id)}" data-source-enabled="${enabled ? "true" : "false"}">
              ${enabled ? "Desactivar" : "Activar"}
            </button>
          </div>
        </article>
      `;
    }).join("");

    target.querySelectorAll("[data-source-id]").forEach((button) => {
      button.addEventListener("click", () => toggleSource(button));
    });
  }

  function renderSocialSources(config) {
    const sources = Array.isArray(config.sources) ? config.sources : [];
    const target = document.getElementById("socialSourcesList");
    if (!sources.length) {
      target.innerHTML = '<p class="empty">No hay fuentes sociales configuradas.</p>';
      return;
    }

    target.innerHTML = sources.map((source) => `
      <article class="post-item">
        <header><h4>${escapeHtml(source.name || source.account || "Fuente social")}</h4></header>
        <div class="post-meta">${escapeHtml(source.platform || "")} · ${escapeHtml(source.account || "")}</div>
        <div class="post-actions">
          <span class="${source.status === "active" ? "ok" : "pending"}">${escapeHtml(source.status || "pendiente")}</span>
        </div>
      </article>
    `).join("");
  }

  async function loadSources() {
    const button = document.getElementById("refreshSourcesButton");
    if (button) {
      button.disabled = true;
      button.textContent = "Actualizando…";
    }
    setMessage("");
    try {
      const [sourcesConfig, socialConfig, postsData] = await Promise.all([
        fetchJson("../sources.json"),
        fetchJson("../social_sources.json"),
        fetchJson("../data/posts.json"),
      ]);
      renderSources(sourcesConfig, postsData);
      renderSocialSources(socialConfig);
    } catch (error) {
      setMessage(error.message, "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Actualizar";
      }
    }
  }

  async function waitForSource(sourceId, enabled) {
    for (let attempt = 1; attempt <= 18; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const config = await fetchJson("../sources.json");
      const source = (config.sources || []).find((item) => item.id === sourceId);
      if (source && (source.enabled !== false) === enabled) return true;
      setMessage("Actualizando fuente… " + attempt + "/18");
    }
    return false;
  }

  async function toggleSource(button) {
    const sourceId = button.dataset.sourceId;
    const currentlyEnabled = button.dataset.sourceEnabled === "true";
    const nextEnabled = !currentlyEnabled;
    const action = nextEnabled ? "activar" : "desactivar";

    if (!confirm("¿Confirmas que quieres " + action + " esta fuente?")) return;

    button.disabled = true;
    const oldText = button.textContent;
    button.textContent = nextEnabled ? "Activando…" : "Desactivando…";
    setMessage("Enviando cambio…");

    try {
      await api("/api/source", {
        method: "POST",
        body: JSON.stringify({ source_id: sourceId, enabled: nextEnabled }),
      });

      // Respuesta visual inmediata mientras GitHub termina el workflow.
      button.dataset.sourceEnabled = nextEnabled ? "true" : "false";
      button.textContent = nextEnabled ? "Desactivar" : "Activar";

      const applied = await waitForSource(sourceId, nextEnabled);
      if (applied) {
        setMessage("Fuente " + (nextEnabled ? "activada" : "desactivada") + " correctamente.", "success");
        await loadSources();
      } else {
        setMessage("El cambio está enviado y GitHub sigue procesándolo. Puedes actualizar en unos segundos.", "error");
      }
    } catch (error) {
      button.dataset.sourceEnabled = currentlyEnabled ? "true" : "false";
      button.textContent = oldText;
      setMessage(error.message, "error");
    } finally {
      button.disabled = false;
    }
  }

  injectModule();
})();
