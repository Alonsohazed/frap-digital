// GET /api/auth/me
import { json, getUser, publicUser } from "../../../server/auth.js";

export async function onRequestGet({ request, env }) {
  const user = await getUser(request, env);
  if (!user) return json({ detail: "No autorizado" }, 401);
  return json(publicUser(user));
}
