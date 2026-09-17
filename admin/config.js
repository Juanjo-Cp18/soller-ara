window.SOLLER_ARA_ADMIN_API = "https://soller-ara-admin.infosollerara.workers.dev";

window.addEventListener("DOMContentLoaded", () => {
  [
    "./sources-v2.js?v=0.48",
    "./activity-v1.js?v=0.48",
  ].forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
});
