const translations = {
  ca: {
    tagline: "Tot el que passa a Sóller, en un sol lloc.",
    "nav.all": "Tot",
    "nav.now": "Ara",
    "nav.news": "Notícies",
    "nav.agenda": "Agenda",
    "nav.alerts": "Avisos",
    "nav.culture": "Cultura",
    "nav.sports": "Esports",
    "nav.commerce": "Comerç",
    "nav.social": "Xarxes",
    "hero.eyebrow": "Avui a Sóller",
    "hero.title": "La informació local, ordenada i accessible.",
    "hero.body": "Una portada única per descobrir avisos, notícies, agenda, cultura, esport, comerç i publicacions de fonts locals.",
    "hero.statusTitle": "Estat del projecte",
    "hero.statusBody": "Versió inicial de demostració · v0.1",
    "feed.eyebrow": "Actualitat",
    "feed.title": "Publicacions destacades",
    "search.placeholder": "Cercar...",
    "footer.nonprofit": "Projecte sense ànim de lucre",
    "card.source": "Font",
    "card.original": "Veure original",
    "card.share": "Compartir",
    "empty": "No hi ha publicacions que coincideixin amb la cerca.",
    categories: { now: "Ara", news: "Notícies", agenda: "Agenda", alerts: "Avisos", culture: "Cultura", sports: "Esports", commerce: "Comerç", social: "Xarxes" }
  },
  es: {
    tagline: "Todo lo que pasa en Sóller, en un solo lugar.",
    "nav.all": "Todo",
    "nav.now": "Ahora",
    "nav.news": "Noticias",
    "nav.agenda": "Agenda",
    "nav.alerts": "Avisos",
    "nav.culture": "Cultura",
    "nav.sports": "Deportes",
    "nav.commerce": "Comercio",
    "nav.social": "Redes",
    "hero.eyebrow": "Hoy en Sóller",
    "hero.title": "La información local, ordenada y accesible.",
    "hero.body": "Una portada única para descubrir avisos, noticias, agenda, cultura, deporte, comercio y publicaciones de fuentes locales.",
    "hero.statusTitle": "Estado del proyecto",
    "hero.statusBody": "Versión inicial de demostración · v0.1",
    "feed.eyebrow": "Actualidad",
    "feed.title": "Publicaciones destacadas",
    "search.placeholder": "Buscar...",
    "footer.nonprofit": "Proyecto sin ánimo de lucro",
    "card.source": "Fuente",
    "card.original": "Ver original",
    "card.share": "Compartir",
    "empty": "No hay publicaciones que coincidan con la búsqueda.",
    categories: { now: "Ahora", news: "Noticias", agenda: "Agenda", alerts: "Avisos", culture: "Cultura", sports: "Deportes", commerce: "Comercio", social: "Redes" }
  },
  en: {
    tagline: "Everything happening in Sóller, in one place.",
    "nav.all": "All",
    "nav.now": "Now",
    "nav.news": "News",
    "nav.agenda": "Events",
    "nav.alerts": "Alerts",
    "nav.culture": "Culture",
    "nav.sports": "Sports",
    "nav.commerce": "Local business",
    "nav.social": "Social",
    "hero.eyebrow": "Today in Sóller",
    "hero.title": "Local information, organized and accessible.",
    "hero.body": "A single homepage for alerts, news, events, culture, sports, local businesses and posts from local sources.",
    "hero.statusTitle": "Project status",
    "hero.statusBody": "Initial demo version · v0.1",
    "feed.eyebrow": "Latest",
    "feed.title": "Featured posts",
    "search.placeholder": "Search...",
    "footer.nonprofit": "Non-profit project",
    "card.source": "Source",
    "card.original": "View original",
    "card.share": "Share",
    "empty": "No posts match your search.",
    categories: { now: "Now", news: "News", agenda: "Events", alerts: "Alerts", culture: "Culture", sports: "Sports", commerce: "Local business", social: "Social" }
  }
};

const posts = [
  {
    id: "demo-1",
    category: "alerts",
    icon: "🚧",
    source: "Ajuntament de Sóller",
    time: "09:20",
    url: "#",
    ca: { title: "Avís de mobilitat al centre", summary: "Exemple de com es mostraria un avís oficial amb la seva font i accés a la publicació original." },
    es: { title: "Aviso de movilidad en el centro", summary: "Ejemplo de cómo se mostraría un aviso oficial con su fuente y acceso a la publicación original." },
    en: { title: "Town-centre mobility notice", summary: "Example of how an official notice would appear with its source and a link to the original publication." }
  },
  {
    id: "demo-2",
    category: "agenda",
    icon: "📅",
    source: "Agenda local",
    time: "11:00",
    url: "#",
    ca: { title: "Activitat cultural aquest cap de setmana", summary: "Les activitats podran ordenar-se per data, categoria, localitat i font d'origen." },
    es: { title: "Actividad cultural este fin de semana", summary: "Las actividades podrán ordenarse por fecha, categoría, localidad y fuente de origen." },
    en: { title: "Cultural event this weekend", summary: "Events can be organized by date, category, town and original source." }
  },
  {
    id: "demo-3",
    category: "news",
    icon: "📰",
    source: "Mitjà local",
    time: "12:40",
    url: "#",
    ca: { title: "Actualitat local reunida en una sola portada", summary: "La futura versió connectarà fonts reals i evitarà duplicats sempre que sigui possible." },
    es: { title: "Actualidad local reunida en una sola portada", summary: "La futura versión conectará fuentes reales y evitará duplicados siempre que sea posible." },
    en: { title: "Local news brought together on one homepage", summary: "A future version will connect real sources and avoid duplicate stories whenever possible." }
  },
  {
    id: "demo-4",
    category: "commerce",
    icon: "🏪",
    source: "Comerç local",
    time: "14:10",
    url: "#",
    ca: { title: "Espai per a informació de comerços i associacions", summary: "Aquesta secció podrà mostrar comunicats públics de comerços, entitats i associacions locals." },
    es: { title: "Espacio para información de comercios y asociaciones", summary: "Esta sección podrá mostrar comunicados públicos de comercios, entidades y asociaciones locales." },
    en: { title: "A space for local businesses and associations", summary: "This section can show public updates from local businesses, organisations and associations." }
  }
];

let currentLanguage = localStorage.getItem("sollerAraLanguage") || "ca";
let currentCategory = "all";
let currentSearch = "";

const languageSelect = document.getElementById("languageSelect");
const feed = document.getElementById("feed");
const searchInput = document.getElementById("searchInput");

function t(key) {
  return translations[currentLanguage][key] ?? translations.ca[key] ?? key;
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

  renderFeed();
}

function renderFeed() {
  const normalizedSearch = currentSearch.trim().toLocaleLowerCase(currentLanguage);
  const visiblePosts = posts.filter((post) => {
    const categoryMatches = currentCategory === "all" || post.category === currentCategory;
    const localized = post[currentLanguage] || post.ca;
    const haystack = `${localized.title} ${localized.summary} ${post.source}`.toLocaleLowerCase(currentLanguage);
    const searchMatches = !normalizedSearch || haystack.includes(normalizedSearch);
    return categoryMatches && searchMatches;
  });

  if (!visiblePosts.length) {
    feed.innerHTML = `<div class="empty">${t("empty")}</div>`;
    return;
  }

  feed.innerHTML = visiblePosts.map((post) => {
    const localized = post[currentLanguage] || post.ca;
    const categoryLabel = translations[currentLanguage].categories[post.category] || post.category;
    return `
      <article class="card">
        <div class="card-media" aria-hidden="true">${post.icon}</div>
        <div class="card-body">
          <div class="meta"><span>${post.source}</span><span>${post.time}</span></div>
          <span class="badge">${categoryLabel}</span>
          <h3>${localized.title}</h3>
          <p>${localized.summary}</p>
          <div class="card-actions">
            <a class="origin-link" href="${post.url}" aria-label="${t("card.original")}">${t("card.original")} →</a>
            <button class="muted-button" type="button" data-share-id="${post.id}">${t("card.share")}</button>
          </div>
        </div>
      </article>`;
  }).join("");

  document.querySelectorAll("[data-share-id]").forEach((button) => {
    button.addEventListener("click", () => sharePost(button.dataset.shareId));
  });
}

async function sharePost(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;
  const localized = post[currentLanguage] || post.ca;
  const shareData = { title: localized.title, text: localized.summary, url: window.location.href };

  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(`${localized.title}\n${window.location.href}`);
  }
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