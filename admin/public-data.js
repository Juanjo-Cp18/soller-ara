(() => {
  const publicRoot = new URL("../", document.currentScript.src);
  const rawRoot = "https://raw.githubusercontent.com/soller-ara/soller-ara/main/";

  window.SOLLER_ARA_READ_JSON = async (path) => {
    // Raw refleja los cambios guardados antes de que termine el despliegue.
    // Ambas direcciones son públicas y no consumen la cuota de la API de GitHub.
    for (const base of [rawRoot, publicRoot.href]) {
      try {
        const url = new URL(path, base);
        url.searchParams.set("v", Date.now());
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "omit",
          signal: AbortSignal.timeout(12000),
        });
        if (response.ok) return await response.json();
      } catch (_) {
        // La copia publicada permite seguir leyendo si falla el servidor raw.
      }
    }
    throw new Error("No se ha podido leer " + path + ". Pulsa Actualizar para volver a intentarlo.");
  };
})();
