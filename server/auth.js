// Shared auth helpers for the Pages Functions.
// Users and the signing secret come from environment bindings, never from code.
import bcrypt from "bcryptjs";

const TOKEN_TTL_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function b64url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(payload, secret, now = Math.floor(Date.now() / 1000)) {
  const header = b64url(encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = b64url(encoder.encode(JSON.stringify({ ...payload, iat: now, exp: now + TOKEN_TTL_SECONDS })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(`${header}.${body}`));
  return `${header}.${body}.${b64url(new Uint8Array(sig))}`;
}

// Returns the payload only if the signature is valid and the token has not expired.
export async function verifyToken(token, secret, now = Math.floor(Date.now() / 1000)) {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromB64url(sig),
      encoder.encode(`${header}.${body}`)
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body)));
    if (typeof payload.exp !== "number" || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

// USERS is a JSON array: [{ id, username, name, role, password_hash }]
export function loadUsers(env) {
  try {
    const list = JSON.parse(env.USERS || "[]");
    return Object.fromEntries(list.map((u) => [u.username, u]));
  } catch {
    return {};
  }
}

export function publicUser(u) {
  return { id: u.id, username: u.username, nombre: u.name, role: u.role };
}

export async function checkPassword(user, password) {
  if (!user || typeof password !== "string") return false;
  return bcrypt.compare(password, user.password_hash);
}

// Resolves the user behind the request's bearer token, or null.
export async function getUser(request, env) {
  if (!env.JWT_SECRET) return null;
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const payload = await verifyToken(auth.slice(7), env.JWT_SECRET);
  if (!payload) return null;
  const user = loadUsers(env)[payload.sub];
  return user ? { ...user, nombre: user.name } : null;
}
