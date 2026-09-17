window.SOLLER_ARA_ADMIN_API = "https://soller-ara-admin.infosollerara.workers.dev";

window.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.src = "./sources.js?v=0.45";
  script.defer = true;
  document.body.appendChild(script);
});
