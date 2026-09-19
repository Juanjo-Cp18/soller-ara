(() => {
  const app = document.getElementById("adminView");
  const nav = document.querySelector(".admin-nav");
  if (!app || !nav || document.getElementById("visits")) return;
  const api = String(window.SOLLER_ARA_ADMIN_API || "").replace(/\/$/, "");
  let controller;
  let requestId = 0;
  const tab = document.createElement("button");
  tab.className = "nav-button";
  tab.type = "button";
  tab.dataset.view = "visits";
  tab.textContent = "Visitas";
  nav.appendChild(tab);
  const section = document.createElement("section");
  section.id = "visits";
  section.className = "module";
  section.innerHTML = `
    <div class="module-heading">
      <div><p class="eyebrow">Audiencia</p><h2>Visitas a Sóller Ara</h2>
        <p class="hint">Estadísticas de la web pública, recogidas por Cloudflare.</p></div>
      <div class="header-actions">
        <label for="visitsPeriod">Periodo</label>
        <select id="visitsPeriod" style="width:auto">
          <option value="24h">Últimas 24 horas</option>
          <option value="7d" selected>Últimos 7 días</option>
        </select>
        <button id="refreshVisits" class="button-secondary" type="button">Actualizar</button>
      </div>
    </div>
    <p id="visitsMessage" class="message" role="status" aria-live="polite"></p>
    <div id="visitsMetrics" hidden><div class="metrics">
      <div class="metric"><span>Visitas</span><strong id="visitsCount">—</strong></div>
      <div class="metric"><span>Páginas vistas</span><strong id="pageviewsCount">—</strong></div>
    </div></div>
    <article class="panel-card">
      <h3>Cómo interpretar el conteo</h3>
      <p>Una misma persona puede hacer varias visitas. Cada página consultada suma una página vista.</p>
      <p>El conteo comienza desde la instalación de la medición. Administración está excluida. Los bloqueadores y las preferencias de privacidad pueden impedir que se registren algunas visitas.</p>
      <p class="hint">Los datos pueden llegar con retraso y Cloudflare puede utilizar estimaciones. Al actualizar se reutiliza la última consulta durante un máximo de cinco minutos.</p>
      <p id="visitsUpdated" class="hint"></p>
    </article>`;
  app.appendChild(section);
  const period = section.querySelector("#visitsPeriod");
  const button = section.querySelector("#refreshVisits");
  const message = section.querySelector("#visitsMessage");
  const metrics = section.querySelector("#visitsMetrics");
  const updated = section.querySelector("#visitsUpdated");

  async function load() {
    const id = ++requestId;
    controller?.abort();
    controller = new AbortController();
    const currentController = controller;
    metrics.hidden = true;
    updated.textContent = "";
    message.textContent = "Consultando visitas…";
    message.className = "message";
    button.disabled = true;
    const timeout = setTimeout(() => currentController.abort(), 20000);
    try {
      const token = sessionStorage.getItem("sollerAraAdminSession");
      if (!token || app.hidden) throw new Error("Entra en Administración para ver las visitas.");
      const response = await fetch(api + "/api/analytics?period=" + encodeURIComponent(period.value), {
        headers: { Authorization: "Bearer " + token }, cache: "no-store", signal: controller.signal,
      });
      if (id !== requestId || app.hidden) return;
      if (response.status === 401) {
        document.getElementById("logoutButton").click();
        return;
      }
      if (response.status === 404) {
        throw new Error("La pestaña está preparada. Falta activar la consulta de visitas en el servidor de Administración.");
      }
      const payload = await response.json();
      if (id !== requestId || app.hidden) return;
      if (!response.ok) throw new Error(payload.error || "No se han podido consultar las visitas.");
      if (![payload.visits, payload.pageviews].every(n => typeof n === "number" && Number.isFinite(n) && n >= 0)) {
        throw new Error("La respuesta no contiene un conteo válido.");
      }
      const number = new Intl.NumberFormat("es-ES");
      section.querySelector("#visitsCount").textContent = number.format(payload.visits);
      section.querySelector("#pageviewsCount").textContent = number.format(payload.pageviews);
      const date = new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Madrid" });
      updated.textContent = "Periodo: " + date.format(new Date(payload.from)) + " – " + date.format(new Date(payload.to)) +
        ". Última consulta: " + date.format(new Date(payload.fetched_at)) + " (hora de Mallorca).";
      metrics.hidden = false;
      message.textContent = payload.pageviews === 0 ? "Cloudflare no registra visitas en este periodo. Si acabas de instalar la medición, espera unos minutos y vuelve a actualizar." : "";
    } catch (error) {
      if (id !== requestId || app.hidden) return;
      message.textContent = error.name === "AbortError" ? "La consulta ha tardado demasiado. Pulsa Actualizar para reintentar." : error.message;
      message.className = "message error";
    } finally {
      clearTimeout(timeout);
      if (id === requestId) button.disabled = false;
    }
  }
  tab.addEventListener("click", () => {
    document.querySelectorAll(".nav-button").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".module").forEach(x => x.classList.remove("active"));
    tab.classList.add("active");
    section.classList.add("active");
    load();
  });
  button.addEventListener("click", load);
  period.addEventListener("change", load);
  new MutationObserver(() => {
    if (app.hidden) {
      requestId++;
      controller?.abort();
      metrics.hidden = true;
      message.textContent = "";
      updated.textContent = "";
      section.querySelector("#visitsCount").textContent = "—";
      section.querySelector("#pageviewsCount").textContent = "—";
      button.disabled = false;
    }
  }).observe(app, { attributes: true, attributeFilter: ["hidden"] });
})();
