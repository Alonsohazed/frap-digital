// Cloudflare Pages Functions - Get Current User
import { FIXED_USERS, verifyToken } from './login.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ detail: "No autorizado" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyToken(token, env.JWT_SECRET || 'default-secret');
  
  if (!payload || !FIXED_USERS[payload.sub]) {
    return new Response(JSON.stringify({ detail: "Token inválido" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const user = FIXED_USERS[payload.sub];
  
  return new Response(JSON.stringify({
    id: user.id,
    username: user.username,
    nombre: user.nombre,
    role: user.role
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
