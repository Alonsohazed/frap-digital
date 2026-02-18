// Cloudflare Pages Functions - Single FRAP API
import { FIXED_USERS, verifyToken } from '../auth/login.js';

async function getUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyToken(token, env.JWT_SECRET || 'default-secret');
  
  if (!payload || !FIXED_USERS[payload.sub]) {
    return null;
  }
  
  return FIXED_USERS[payload.sub];
}

// GET /api/fraps/[id] - Get single FRAP
export async function onRequestGet(context) {
  const { request, env, params } = context;
  const frapId = params.id;
  
  const user = await getUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ detail: "No autorizado" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const { results } = await env.DB.prepare('SELECT * FROM fraps WHERE id = ?').bind(frapId).all();
  
  if (results.length === 0) {
    return new Response(JSON.stringify({ detail: "FRAP no encontrado" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const row = results[0];
  
  if (user.role !== 'admin' && row.created_by !== user.id) {
    return new Response(JSON.stringify({ detail: "Sin acceso a este FRAP" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const data = JSON.parse(row.data);
  
  return new Response(JSON.stringify({
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    created_by_name: row.created_by_name,
    ...data
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// PUT /api/fraps/[id] - Update FRAP (Solo administradores pueden editar)
export async function onRequestPut(context) {
  const { request, env, params } = context;
  const frapId = params.id;
  
  const user = await getUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ detail: "No autorizado" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Solo administradores pueden editar FRAPs
  if (user.role !== 'admin') {
    return new Response(JSON.stringify({ detail: "Solo los administradores pueden editar FRAPs" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const { results } = await env.DB.prepare('SELECT * FROM fraps WHERE id = ?').bind(frapId).all();
  
  if (results.length === 0) {
    return new Response(JSON.stringify({ detail: "FRAP no encontrado" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const row = results[0];
  
  const frapData = await request.json();
  const now = new Date().toISOString();
  
  // Check for duplicate folio (exclude current record)
  if (frapData.folio && frapData.folio.trim() !== '') {
    const { results: existing } = await env.DB.prepare(
      'SELECT id FROM fraps WHERE folio = ? AND id != ?'
    ).bind(frapData.folio, frapId).all();
    
    if (existing.length > 0) {
      return new Response(JSON.stringify({ 
        detail: `El folio ${frapData.folio} ya existe en otro registro.` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  await env.DB.prepare(
    'UPDATE fraps SET folio = ?, data = ?, updated_at = ? WHERE id = ?'
  ).bind(frapData.folio || row.folio, JSON.stringify(frapData), now, frapId).run();
  
  return new Response(JSON.stringify({
    id: frapId,
    created_at: row.created_at,
    updated_at: now,
    created_by: row.created_by,
    created_by_name: row.created_by_name,
    ...frapData
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// DELETE /api/fraps/[id] - Delete FRAP
export async function onRequestDelete(context) {
  const { request, env, params } = context;
  const frapId = params.id;
  
  const user = await getUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ detail: "No autorizado" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (user.role !== 'admin') {
    return new Response(JSON.stringify({ detail: "Solo administradores pueden eliminar" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const { results } = await env.DB.prepare('SELECT id FROM fraps WHERE id = ?').bind(frapId).all();
  
  if (results.length === 0) {
    return new Response(JSON.stringify({ detail: "FRAP no encontrado" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  await env.DB.prepare('DELETE FROM fraps WHERE id = ?').bind(frapId).run();
  
  return new Response(JSON.stringify({ message: "FRAP eliminado correctamente" }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
