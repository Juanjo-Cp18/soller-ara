(() => {
  const API = String(window.SOLLER_ARA_ADMIN_API || "").replace(/\/$/, "");
  const TOKEN_KEY = "sollerAraAdminSession";

  const loginView = document.getElementById("loginView");
  const adminView = document.getElementById("adminView");
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const setupMessage = document.getElementById("setupMessage");
  const logoutButton = document.getElementById("logoutButton");
  const refreshButton = document.getElementById("refreshButton");
  const systemCheckButton = document.getElementById("systemCheckButton");
  const systemCheckResult = document.getElementById("systemCheckResult");
  const publishForm = document.getElementById("publishForm");
  const publishMessage = document.getElementById("publishMessage");
  const moderationMessage = document.getElementById("moderationMessage");
  const postSearch = document.getElementById("postSearch");
  const previewTitle = document.getElementById("previewTitle");
  const previewBody = document.getElementById("previewBody");

  let statusPayload = null;

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  }

  function setToken(token) {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }

  function setMessage(element, text, kind = "") {
    element.textContent = text || "";
    element.className = "message" + (kind ? " " + kind : "");
  }

  async function api(path, options = {}) {
    if (!API) throw new Error("Backend de Administración no configurado.");

    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");
    const token = getToken();
    if (token) headers.set("Authorization", "Bearer " + token);

    const response = await fetch(API + path, {
      ...options,
      headers,
      mode: "cors",
      cache: "no-store",
    });

    let payload = {};
    try { payload = await response.json(); } catch (_) {}

    if (response.status === 401) {
      setToken("");
      showLogin();
      throw new Error(payload.error || "La sesión ha caducado.");
    }

    if (!response.ok) {
      throw new Error(payload.error || "Error de Administración (" + response.status + ").");
    }

    return payload;
  }

  function showLogin() {
    loginView.hidden = false;
    adminView.hidden = true;
  }

  function showAdmin() {
    loginView.hidden = true;
    adminView.hidden = false;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(value));
    } catch (_) {
      return value;
    }
  }

  function renderMetrics(data) {
    const posts = Array.isArray(data.posts?.posts) ? data.posts.posts : [];
    const sources = Array.isArray(data.posts?.source_status) ? data.posts.source_status : [];
    const failedSources = sources.filter((item) => item.ok === false).length;
    const ownPosts = posts.filter((item) => item.source_type === "own").length;

    document.getElementById("metrics").innerHTML = [
      ["Publicaciones", posts.length],
      ["Contenido propio", ownPosts],
      ["Fuentes con error", failedSources],
      ["Última actualización", formatDate(data.posts?.fetched_at)],
    ].map(([label, value]) => `
      <div class="metric">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `).join("");
  }

  function renderSources(data) {
    const sources = Array.isArray(data.posts?.source_status) ? data.posts.source_status : [];
    const target = document.getElementById("sourceStatus");

    if (!sources.length) {
      target.innerHTML = '<p class="empty">Sin datos de fuentes.</p>';
      return;
    }

    target.innerHTML = sources.map((item) => `
      <div class="status-line">
        <div>
          <strong>${escapeHtml(item.name || item.source_id || "Fuente")}</strong><br />
          <small>${escapeHtml(item.method || "")} · ${escapeHtml(item.count ?? 0)} publicaciones</small>
        </div>
        <span class="${item.ok ? "ok" : "bad"}">${item.ok ? "OK" : "ERROR"}</span>
      </div>
    `).join("");
  }

  function renderSocial(data) {
    const statuses = Array.isArray(data.posts?.social_integration_status)
      ? data.posts.social_integration_status
      : [];
    const log = Array.isArray(data.socialLog?.entries) ? data.socialLog.entries : [];
    const target = document.getElementById("socialStatus");

    const latestByPlatform = {};
    for (const entry of log) {
      const platform = entry.platform || "social";
      if (!latestByPlatform[platform] || new Date(entry.recorded_at) > new Date(latestByPlatform[platform].recorded_at)) {
        latestByPlatform[platform] = entry;
      }
    }

    const blocks = [];

    for (const item of statuses) {
      blocks.push(`
        <div class="status-line">
          <div><strong>${escapeHtml(item.name || item.source_id || "Meta")}</strong><br />
          <small>${escapeHtml(item.error || item.status || "")}</small></div>
          <span class="${item.ok ? "ok" : item.error ? "bad" : "pending"}">${item.ok ? "OK" : item.error ? "ERROR" : "PENDIENTE"}</span>
        </div>
      `);
    }

    for (const [platform, entry] of Object.entries(latestByPlatform)) {
      blocks.push(`
        <div class="status-line">
          <div><strong>Última publicación ${escapeHtml(platform)}</strong><br />
          <small>${escapeHtml(formatDate(entry.recorded_at))}</small></div>
          <span class="${entry.status === "success" ? "ok" : "bad"}">${escapeHtml(entry.status || "")}</span>
        </div>
      `);
    }

    target.innerHTML = blocks.length ? blocks.join("") : '<p class="empty">Sin actividad social registrada.</p>';
  }

  function filteredPosts() {
    const posts = Array.isArray(statusPayload?.posts?.posts) ? statusPayload.posts.posts : [];
    const query = String(postSearch.value || "").trim().toLocaleLowerCase("es");
    if (!query) return posts;
    return posts.filter((post) => {
      const haystack = [post.title, post.summary, post.source, post.category].join(" ").toLocaleLowerCase("es");
      return haystack.includes(query);
    });
  }

  function renderPosts() {
    const target = document.getElementById("postList");
    const posts = filteredPosts().slice(0, 120);

    if (!posts.length) {
      target.innerHTML = '<p class="empty">No hay publicaciones.</p>';
    } else {
      target.innerHTML = posts.map((post) => {
        const own = post.source_type === "own";
        return `
          <article class="post-item">
            <header><h4>${escapeHtml(post.title || "Sin título")}</h4></header>
            <div class="post-meta">${escapeHtml(post.source || "")} · ${escapeHtml(post.category || "")} · ${escapeHtml(formatDate(post.published_at))}</div>
            <div class="post-actions">
              ${post.url ? `<a class="button-link" href="${escapeHtml(post.url)}" target="_blank" rel="noopener">Abrir</a>` : ""}
              ${own
                ? `<button class="danger" type="button" data-action="delete-own" data-post-id="${escapeHtml(post.id)}">Eliminar</button>`
                : `<button type="button" data-action="hide" data-post-id="${escapeHtml(post.id)}">Ocultar</button>`
              }
            </div>
          </article>
        `;
      }).join("");
    }

    target.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => moderate(button.dataset.action, button.dataset.postId));
    });

    renderHidden();
  }

  function renderHidden() {
    const target = document.getElementById("hiddenList");
    const hidden = Array.isArray(statusPayload?.moderation?.hidden_post_ids)
      ? statusPayload.moderation.hidden_post_ids
      : [];

    if (!hidden.length) {
      target.innerHTML = '<p class="empty">No hay publicaciones ocultadas.</p>';
      return;
    }

    target.innerHTML = hidden.map((id) => `
      <article class="post-item">
        <h4>${escapeHtml(id)}</h4>
        <div class="post-meta">Ocultada del feed</div>
        <div class="post-actions">
          <button type="button" data-unhide-id="${escapeHtml(id)}">Restaurar</button>
        </div>
      </article>
    `).join("");

    target.querySelectorAll("[data-unhide-id]").forEach((button) => {
      button.addEventListener("click", () => moderate("unhide", button.dataset.unhideId));
    });
  }


  async function runSystemCheck() {
    systemCheckButton.disabled = true;
    systemCheckButton.textContent = "Comprobando…";
    systemCheckResult.hidden = false;
    systemCheckResult.innerHTML = "<p>Comprobando Cloudflare, GitHub y workflows…</p>";

    try {
      const result = await api("/api/check");
      const checks = Array.isArray(result.checks) ? result.checks : [];
      systemCheckResult.innerHTML = `
        <h3>Comprobación del sistema</h3>
        ${checks.map((item) => `
          <div class="status-line">
            <div>
              <strong>${escapeHtml(item.name || "Comprobación")}</strong><br />
              <small>${escapeHtml(item.detail || "")}</small>
            </div>
            <span class="${item.ok ? "ok" : "bad"}">${item.ok ? "OK" : "ERROR"}</span>
          </div>
        `).join("")}
      `;
    } catch (error) {
      systemCheckResult.innerHTML = '<p class="bad">' + escapeHtml(error.message) + '</p>';
    } finally {
      systemCheckButton.disabled = false;
      systemCheckButton.textContent = "Comprobar sistema";
    }
  }

  async function loadStatus() {
    const buttonText = refreshButton.textContent;
    refreshButton.disabled = true;
    refreshButton.textContent = "Actualizando…";
    try {
      statusPayload = await api("/api/status");
      renderMetrics(statusPayload);
      renderSources(statusPayload);
      renderSocial(statusPayload);
      renderPosts();
    } catch (error) {
      document.getElementById("connectionState").textContent = "Error";
      document.getElementById("connectionState").className = "status-pill bad";
      setMessage(moderationMessage, error.message, "error");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = buttonText;
    }
  }

  async function moderate(action, postId) {
    const labels = {
      "delete-own": "eliminar definitivamente esta publicación propia",
      "hide": "ocultar esta publicación",
      "unhide": "restaurar esta publicación",
    };
    if (!confirm("¿Confirmas que quieres " + (labels[action] || "realizar esta acción") + "?")) return;

    setMessage(moderationMessage, "Enviando acción…");
    try {
      await api("/api/moderate", {
        method: "POST",
        body: JSON.stringify({ action, post_id: postId }),
      });
      setMessage(moderationMessage, "Acción enviada correctamente. El cambio aparecerá cuando termine el workflow.", "success");
      setTimeout(loadStatus, 3500);
    } catch (error) {
      setMessage(moderationMessage, error.message, "error");
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(loginMessage, "Comprobando…");
    const password = new FormData(loginForm).get("password");

    try {
      const result = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setToken(result.token || "");
      loginForm.reset();
      setMessage(loginMessage, "");
      showAdmin();
      await loadStatus();
    } catch (error) {
      setMessage(loginMessage, error.message, "error");
    }
  });

  logoutButton.addEventListener("click", () => {
    setToken("");
    showLogin();
  });

  refreshButton.addEventListener("click", loadStatus);
  systemCheckButton.addEventListener("click", runSystemCheck);
  postSearch.addEventListener("input", renderPosts);

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-button").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".module").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.view).classList.add("active");
    });
  });

  publishForm.addEventListener("input", () => {
    const data = new FormData(publishForm);
    previewTitle.textContent = data.get("title") || "Título de la publicación";
    previewBody.textContent = data.get("body") || "El texto aparecerá aquí.";
  });

  publishForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(publishForm);
    const payload = {
      title: String(data.get("title") || "").trim(),
      body: String(data.get("body") || "").trim(),
      category: String(data.get("category") || "news"),
      language: String(data.get("language") || "ca"),
      image_url: String(data.get("image_url") || "").trim(),
      facebook: data.get("facebook") === "on",
      instagram: data.get("instagram") === "on",
    };

    if (!payload.title || !payload.body) return;

    if (!confirm("¿Publicar ahora en Sóller Ara" +
      (payload.facebook ? ", Facebook" : "") +
      (payload.instagram ? " e Instagram" : "") + "?")) return;

    setMessage(publishMessage, "Enviando publicación…");
    const submitButton = publishForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
      const result = await api("/api/publish", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage(publishMessage, "Publicación enviada. Workflow: " + (result.workflow || "iniciado") + ".", "success");
      publishForm.reset();
      previewTitle.textContent = "Título de la publicación";
      previewBody.textContent = "El texto aparecerá aquí.";
      setTimeout(loadStatus, 4500);
    } catch (error) {
      setMessage(publishMessage, error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  if (!API) {
    setupMessage.hidden = false;
    loginForm.querySelector("button").disabled = true;
    setMessage(loginMessage, "Falta conectar el backend privado.");
    return;
  }

  if (getToken()) {
    showAdmin();
    loadStatus().catch(() => showLogin());
  } else {
    showLogin();
  }
})();
