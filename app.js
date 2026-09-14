const translations = {
  ca: {
    tagline: "Tot el que passa a Sóller, en un sol lloc.",
    "nav.all": "Tot",
    "nav.now": "Ara",
    "nav.news": "Notícies",
    "nav.agenda": "Agenda",
    "nav.alerts": "Avisos",
    "nav.services": "Serveis",
    "nav.culture": "Cultura",
    "nav.sports": "Esports",
    "nav.commerce": "Comerç",
    "nav.social": "Xarxes",
    "hero.eyebrow": "Avui a Sóller",
    "hero.title": "La informació local, ordenada i accessible.",
    "hero.body": "Una portada única per descobrir avisos, serveis, notícies, agenda, cultura, esport, comerç i publicacions de fonts locals.",
    "hero.statusTitle": "Font real connectada",
    "hero.statusBody": "Ajuntament de Sóller · actualització automàtica",
    "feed.eyebrow": "Actualitat",
    "feed.title": "Publicacions destacades",
    "feed.loading": "Carregant actualització...",
    "feed.updated": "Darrera actualització",
    "feed.demo": "Dades de demostració: la font automàtica encara no està disponible.",
    "search.placeholder": "Cercar...",
    "footer.nonprofit": "Projecte sense ànim de lucre",
    "card.original": "Veure original",
    "card.share": "Compartir",
    "empty": "No hi ha publicacions que coincideixin amb la cerca.",
    categories: { now: "Ara", news: "Notícies", agenda: "Agenda", alerts: "Avisos", services: "Serveis", culture: "Cultura", sports: "Esports", commerce: "Comerç", social: "Xarxes" }
  },
  es: {
    tagline: "Todo lo que pasa en Sóller, en un solo lugar.",
    "nav.all": "Todo",
    "nav.now": "Ahora",
    "nav.news": "Noticias",
    "nav.agenda": "Agenda",
    "nav.alerts": "Avisos",
    "nav.services": "Servicios",
    "nav.culture": "Cultura",
    "nav.sports": "Deportes",
    "nav.commerce": "Comercio",
    "nav.social": "Redes",
    "hero.eyebrow": "Hoy en Sóller",
    "hero.title": "La información local, ordenada y accesible.",
    "hero.body": "Una portada única para descubrir avisos, servicios, noticias, agenda, cultura, deporte, comercio y publicaciones de fuentes locales.",
    "hero.statusTitle": "Fuente real conectada",
    "hero.statusBody": "Ayuntamiento de Sóller · actualización automática",
    "feed.eyebrow": "Actualidad",
    "feed.title": "Publicaciones destacadas",
    "feed.loading": "Cargando actualización...",
    "feed.updated": "Última actualización",
    "feed.demo": "Datos de demostración: la fuente automática aún no está disponible.",
    "search.placeholder": "Buscar...",
    "footer.nonprofit": "Proyecto sin ánimo de lucro",
    "card.original": "Ver original",
    "card.share": "Compartir",
    "empty": "No hay publicaciones que coincidan con la búsqueda.",
    categories: { now: "Ahora", news: "Noticias", agenda: "Agenda", alerts: "Avisos", services: "Servicios", culture: "Cultura", sports: "Deportes", commerce: "Comercio", social: "Redes" }
  },
  en: {
    tagline: "Everything happening in Sóller, in one place.",
    "nav.all": "All",
    "nav.now": "Now",
    "nav.news": "News",
    "nav.agenda": "Events",
    "nav.alerts": "Alerts",
    "nav.services": "Services",
    "nav.culture": "Culture",
    "nav.sports": "Sports",
    "nav.commerce": "Local business",
    "nav.social": "Social",
    "hero.eyebrow": "Today in Sóller",
    "hero.title": "Local information, organized and accessible.",
    "hero.body": "A single homepage for alerts, services, news, events, culture, sports, local businesses and posts from local sources.",
    "hero.statusTitle": "Live source connected",
    "hero.statusBody": "Sóller Town Council · automatic updates",
    "feed.eyebrow": "Latest",
    "feed.title": "Featured posts",
    "feed.loading": "Loading update...",
    "feed.updated": "Last updated",
    "feed.demo": "Demo data: the automatic source is not available yet.",
    "search.placeholder": "Search...",
    "footer.nonprofit": "Non-profit project",
    "card.original": "View original",
    "card.share": "Share",
    "empty": "No posts match your search.",
    categories: { now: "Now", news: "News", agenda: "Events", alerts: "Alerts", services: "Services", culture: "Culture", sports: "Sports", commerce: "Local business", social: "Social" }
  }
};

const demoPosts = [
  {
    id: "demo-1",
    category: "news",
    source: "Ajuntament de Sóller",
    source_type: "official",
    language: "ca",
    locality: "Sóller",
    published_at: "2026-09-10T09:00:00+02:00",
    title: "Reunió informativa sobre el Porta a Porta per a la restauració i els comerços (HoReCa)",
    summary: "Exemple provisional mentre es completa la primera actualització automàtica de la font oficial.",
    url: "https://ajsoller.net/ca/noticies/reunio-informativa-sobre-el-porta-porta-la-restauracio-i-els-comercos-horeca"
  }
];

let posts = [];
let fetchedAt = null;
let usingDemoData = false;
let currentLanguage = localStorage.getItem("sollerAraLanguage") || "ca";
let currentCategory = "all";
let currentSearch = "";

const languageSelect = document.getElementById("languageSelect");
const feed = document.getElementById("feed");
const searchInput = document.getElementById("searchInput");
const lastUpdated = document.getElementById("lastUpdated");

function t(key) {
  return translations[currentLanguage][key] ?? translations.ca[key] ?? key;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const locale = currentLanguage === "ca" ? "ca-ES" : currentLanguage === "es" ? "es-ES" : "en-GB";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function isNowPost(post) {
  if (post.category === "alerts") return true;
  if (!post.published_at) return false;
  const age = Date.now() - new Date(post.published_at).getTime();
  return age >= 0 && age <= 72 * 60 * 60 * 1000;
}

function iconFor(category) {
  return {
    alerts: "🚨",
    services: "🛠️",
    agenda: "📅",
    culture: "🎭",
    sports: "⚽",
    commerce: "🏪",
    social: "📱",
    news: "📰"
  }[category] || "📰";
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  languageSelect.value = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  updateLastUpdated();
  renderFeed();
}

function updateLastUpdated() {
  if (usingDemoData) {
    lastUpdated.textContent = t("feed.demo");
    return;
  }
  if (!fetchedAt) {
    lastUpdated.textContent = t("feed.loading");
    return;
  }
  const date = new Date(fetchedAt);
  const locale = currentLanguage === "ca" ? "ca-ES" : currentLanguage === "es" ? "es-ES" : "en-GB";
  const formatted = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
  lastUpdated.textContent = `${t("feed.updated")}: ${formatted}`;
}

function renderFeed() {
  const normalizedSearch = currentSearch.trim().toLocaleLowerCase(currentLanguage);
  const visiblePosts = posts.filter((post) => {
    const categoryMatches = currentCategory === "all"
      || (currentCategory === "now" ? isNowPost(post) : post.category === currentCategory);
    const haystack = `${post.title || ""} ${post.summary || ""} ${post.source || ""}`.toLocaleLowerCase(currentLanguage);
    const searchMatches = !normalizedSearch || haystack.includes(normalizedSearch);
    return categoryMatches && searchMatches;
  });

  if (!visiblePosts.length) {
    feed.innerHTML = `<div class="empty">${t("empty")}</div>`;
    return;
  }

  feed.innerHTML = visiblePosts.map((post) => {
    const categoryLabel = translations[currentLanguage].categories[post.category] || post.category;
    const safeUrl = post.url || "#";
    return `
      <article class="card">
        <div class="card-media" aria-hidden="true">${iconFor(post.category)}</div>
        <div class="card-body">
          <div class="meta">
            <span class="source-wrap">${post.source_type === "official" ? '<span class="official-dot" aria-hidden="true"></span>' : ""}<span class="source-name">${escapeHtml(post.source || "")}</span></span>
            <span>${formatDate(post.published_at)}</span>
          </div>
          <span class="badge">${escapeHtml(categoryLabel)}</span>
          <h3>${escapeHtml(post.title || "")}</h3>
          <p>${escapeHtml(post.summary || "")}</p>
          <div class="card-actions">
            <a class="origin-link" href="${escapeAttribute(safeUrl)}" target="_blank" rel="noopener noreferrer">${t("card.original")} →</a>
            <button class="muted-button" type="button" data-share-id="${escapeAttribute(post.id || "")}">${t("card.share")}</button>
          </div>
        </div>
      </article>`;
  }).join("");

  document.querySelectorAll("[data-share-id]").forEach((button) => {
    button.addEventListener("click", () => sharePost(button.dataset.shareId));
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

async function sharePost(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;
  const shareData = { title: post.title, text: post.summary, url: post.url || window.location.href };

  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(`${post.title}\n${post.url || window.location.href}`);
  }
}

async function loadPosts() {
  try {
    const response = await fetch(`data/posts.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.posts)) throw new Error("Invalid posts payload");
    posts = payload.posts;
    fetchedAt = payload.fetched_at || null;
    usingDemoData = false;
  } catch (error) {
    console.warn("No s'ha pogut carregar data/posts.json", error);
    posts = demoPosts;
    fetchedAt = null;
    usingDemoData = true;
  }
  updateLastUpdated();
  renderFeed();
}

languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;
  localStorage.setItem("sollerAraLanguage", currentLanguage);
  applyTranslations();
});

searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value;
  renderFeed();
});

document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderFeed();
  });
});

applyTranslations();
loadPosts();
