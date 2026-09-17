window.SOLLER_ARA_ADMIN_API = "https://soller-ara-admin.infosollerara.workers.dev";

window.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.src = "./sources-v2.js?v=0.47";
  script.defer = true;
  document.body.appendChild(script);
});
