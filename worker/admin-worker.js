const DEFAULT_ORIGIN = "https://soller-ara.github.io";
const DEFAULT_OWNER = "soller-ara";
const DEFAULT_REPO = "soller-ara";
const DEFAULT_BRANCH = "main";
const SESSION_SECONDS = 8 * 60 * 60;

const failedLogins = new Map();

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/health") {
        return json({ ok: true, service: "soller-ara-admin" }, 200, cors);
      }

      if (url.pathname === "/api/login" && request.method === "POST") {
        return await login(request, env, cors);
      }

      const session = await requireSession(request, env);
      if (!session) return json({ error: "Sesión no válida o caducada." }, 401, cors);

      if (url.pathname === "/api/status" && request.method === "GET") {
        return await status(env, cors);
      }

      if (url.pathname === "/api/check" && request.method === "GET") {
        return await systemCheck(env, cors);
      }

      if (url.pathname === "/api/publish" && request.method === "POST") {
        return await publish(request, env, cors);
      }

      if (url.pathname === "/api/edit" && request.method === "POST") {
        return await editOwn(request, env, cors);
      }

      if (url.pathname === "/api/moderate" && request.method === "POST") {
        return await moderate(request, env, cors);
      }

      return json({ error: "Ruta no encontrada." }, 404, cors);
    } catch (error) {
      console.error(error);
      return json({ error: "Error interno de Administración." }, 500, cors);
    }
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Cache-Control": "no-store",
  };
}

function json(payload, status = 200, extra = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...extra, "Content-Type": "application/json; charset=utf-8" },
  });
}

async function sha256(value) {
  const data = new TextEncoder().encode(String(value));
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function secureEqual(a, b) {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  return equalBytes(ha, hb);
}

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

function loginState(ip) {
  const now = Date.now();
  const item = failedLogins.get(ip);
  if (!item || now - item.first > 15 * 60 * 1000) {
    const fresh = { first: now, count: 0 };
    failedLogins.set(ip, fresh);
    return fresh;
  }
  return item;
}

async function login(request, env, cors) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return json({ error: "Administración no configurada." }, 503, cors);
  }

  const ip = clientIp(request);
  const state = loginState(ip);
  if (state.count >= 5) {
    return json({ error: "Demasiados intentos. Prueba más tarde." }, 429, cors);
  }

  const body = await request.json().catch(() => ({}));
  const supplied = String(body.password || "");

  if (!await secureEqual(supplied, env.ADMIN_PASSWORD)) {
    state.count += 1;
    failedLogins.set(ip, state);
    return json({ error: "Clave incorrecta." }, 401, cors);
  }

  failedLogins.delete(ip);
  const token = await createSession(env.SESSION_SECRET);
  return json({ ok: true, token, expires_in: SESSION_SECONDS }, 200, cors);
}

function base64urlBytes(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64urlText(value) {
  return base64urlBytes(new TextEncoder().encode(value));
}

function decodeBase64urlText(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function createSession(secret) {
  const payload = {
    sub: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const encoded = base64urlText(JSON.stringify(payload));
  const signature = base64urlBytes(await hmac(secret, encoded));
  return encoded + "." + signature;
}

async function verifySession(secret, token) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) return null;

  const expected = base64urlBytes(await hmac(secret, encoded));
  if (!await secureEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(decodeBase64urlText(encoded));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

async function requireSession(request, env) {
  if (!env.SESSION_SECRET) return null;
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  return verifySession(env.SESSION_SECRET, auth.slice(7));
}

function repoParts(env) {
  return {
    owner: env.GITHUB_OWNER || DEFAULT_OWNER,
    repo: env.GITHUB_REPO || DEFAULT_REPO,
    branch: env.GITHUB_BRANCH || DEFAULT_BRANCH,
  };
}

async function rawJson(owner, repo, branch, path, fallback) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}?v=${Date.now()}`;
  const response = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!response.ok) return fallback;
  return response.json();
}


async function systemCheck(env, cors) {
  const checks = [];
  const { owner, repo, branch } = repoParts(env);

  checks.push({
    name: "Cloudflare Worker",
    ok: true,
    detail: "Backend de Administración activo",
  });

  checks.push({
    name: "Clave de Administración",
    ok: Boolean(env.ADMIN_PASSWORD),
    detail: env.ADMIN_PASSWORD ? "Secret configurado" : "Falta ADMIN_PASSWORD",
  });

  checks.push({
    name: "Sesiones",
    ok: Boolean(env.SESSION_SECRET),
    detail: env.SESSION_SECRET ? "SESSION_SECRET configurado" : "Falta SESSION_SECRET",
  });

  if (!env.GITHUB_TOKEN) {
    checks.push({
      name: "GitHub",
      ok: false,
      detail: "Falta GITHUB_TOKEN",
    });
    return json({ ok: false, checks }, 200, cors);
  }

  const headers = {
    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "SollerAra-Admin/0.43",
  };

  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  checks.push({
    name: "GitHub · repositorio",
    ok: repoResponse.ok,
    detail: repoResponse.ok ? `${owner}/${repo} accesible` : `HTTP ${repoResponse.status}`,
  });

  const workflows = ["publish-own-content.yml", "edit-own-content.yml", "manage-posts.yml"];
  for (const workflow of workflows) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}`,
      { headers }
    );
    checks.push({
      name: `Workflow · ${workflow}`,
      ok: response.ok,
      detail: response.ok ? "Disponible para Administración" : `HTTP ${response.status}`,
    });
  }

  const publicData = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/data/posts.json?v=${Date.now()}`,
    { headers: { "Cache-Control": "no-cache" } }
  );
  checks.push({
    name: "Datos públicos",
    ok: publicData.ok,
    detail: publicData.ok ? "data/posts.json accesible" : `HTTP ${publicData.status}`,
  });

  return json({
    ok: checks.every((item) => item.ok),
    checks,
  }, 200, cors);
}

async function status(env, cors) {
  const { owner, repo, branch } = repoParts(env);
  const [posts, moderation, socialLog] = await Promise.all([
    rawJson(owner, repo, branch, "data/posts.json", { posts: [], source_status: [], social_integration_status: [] }),
    rawJson(owner, repo, branch, "data/moderation.json", { hidden_post_ids: [] }),
    rawJson(owner, repo, branch, "data/social_publish_log.json", { entries: [] }),
  ]);

  return json({ ok: true, posts, moderation, socialLog }, 200, cors);
}

async function githubDispatch(env, workflow, inputs) {
  if (!env.GITHUB_TOKEN) throw new Error("Falta GITHUB_TOKEN");
  const { owner, repo, branch } = repoParts(env);

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "SollerAra-Admin/0.41",
      },
      body: JSON.stringify({ ref: branch, inputs }),
    }
  );

  if (response.status !== 204) {
    const text = await response.text();
    console.error("GitHub dispatch error", response.status, text);
    throw new Error("GitHub no ha aceptado el workflow");
  }
}

async function publish(request, env, cors) {
  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  const text = String(body.body || "").trim();

  if (!title || !text) return json({ error: "Faltan título o texto." }, 400, cors);
  if (title.length > 180) return json({ error: "El título es demasiado largo." }, 400, cors);

  const allowedCategories = new Set(["news", "agenda", "alerts", "services", "culture", "sports", "commerce"]);
  const allowedLanguages = new Set(["ca", "es", "en"]);
  const category = allowedCategories.has(body.category) ? body.category : "news";
  const language = allowedLanguages.has(body.language) ? body.language : "ca";

  await githubDispatch(env, "publish-own-content.yml", {
    confirmation: "PUBLICAR",
    title,
    body: text,
    category,
    language,
    image_url: String(body.image_url || "").trim(),
    facebook: Boolean(body.facebook),
    instagram: Boolean(body.instagram),
  });

  return json({ ok: true, workflow: "Sóller Ara · publicar contingut propi" }, 202, cors);
}

async function editOwn(request, env, cors) {
  const body = await request.json().catch(() => ({}));
  const postId = String(body.post_id || "").trim();
  const title = String(body.title || "").trim();
  const text = String(body.body || "").trim();

  if (!postId || !title || !text) {
    return json({ error: "Faltan datos para editar la publicación." }, 400, cors);
  }
  if (title.length > 180) {
    return json({ error: "El título es demasiado largo." }, 400, cors);
  }

  const allowedCategories = new Set(["news", "agenda", "alerts", "services", "culture", "sports", "commerce"]);
  const allowedLanguages = new Set(["ca", "es", "en"]);
  const category = allowedCategories.has(body.category) ? body.category : "news";
  const language = allowedLanguages.has(body.language) ? body.language : "ca";

  await githubDispatch(env, "edit-own-content.yml", {
    confirmation: "GUARDAR",
    post_id: postId,
    title,
    body: text,
    category,
    language,
    image_url: String(body.image_url || "").trim(),
  });

  return json({ ok: true, workflow: "Sóller Ara · editar contingut propi" }, 202, cors);
}

async function moderate(request, env, cors) {
  const body = await request.json().catch(() => ({}));
  const allowed = new Set(["hide", "unhide", "delete-own"]);
  const action = String(body.action || "");
  const postId = String(body.post_id || "").trim();

  if (!allowed.has(action) || !postId) {
    return json({ error: "Acción de moderación no válida." }, 400, cors);
  }

  await githubDispatch(env, "manage-posts.yml", {
    action,
    post_id: postId,
    note: "",
    confirmation: "CONFIRMAR",
  });

  return json({ ok: true, workflow: "Sóller Ara · gestionar publicacions" }, 202, cors);
}
