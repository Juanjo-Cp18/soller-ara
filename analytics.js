// Public Cloudflare Web Analytics site token, never an API credential.
(() => {
  const token = "6766f7c4cf4d466b8652c57227a962da";
  const path = window.location.pathname;
  if (window.location.origin !== "https://soller-ara.github.io" ||
      !path.startsWith("/soller-ara/") ||
      path.startsWith("/soller-ara/admin/") || path === "/soller-ara/admin" ||
      navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true ||
      document.querySelector("script[data-cf-beacon]")) return;
  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.defer = true;
  beacon.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  document.head.appendChild(beacon);
})();
