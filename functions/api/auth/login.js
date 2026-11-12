// POST /api/auth/login
import { json, loadUsers, checkPassword, signToken, publicUser } from "../../../server/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.JWT_SECRET) {
    return json({ detail: "Servidor sin configurar" }, 500);
  }
  try {
    const { username, password } = await request.json();
    const user = loadUsers(env)[username];
    if (!(await checkPassword(user, password))) {
      return json({ detail: "Usuario o contraseña incorrectos" }, 401);
    }
    const token = await signToken({ sub: user.username }, env.JWT_SECRET);
    return json({ access_token: token, token_type: "bearer", user: publicUser(user) });
  } catch {
    return json({ detail: "Error en el servidor" }, 500);
  }
}
