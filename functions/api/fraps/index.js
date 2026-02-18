// Cloudflare Pages Functions - FRAPS API
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

// GET /api/fraps - List FRAPs
export async function onRequestGet(context) {
  const { request, env } = context;
  
  const user = await getUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ detail: "No autorizado" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  
  let query = 'SELECT * FROM fraps';
  let params = [];
  
  if (user.role !== 'admin') {
    query += ' WHERE created_by = ?';
    params.push(user.id);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const { results } = await env.DB.prepare(query).bind(...params).all();
  
  const fraps = results.map(row => {
    const data = JSON.parse(row.data);
    return {
      id: row.id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      created_by: row.created_by,
      created_by_name: row.created_by_name,
      ...data
    };
  }).filter(frap => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const nombre = (frap.nombre_paciente || '').toLowerCase();
    const folio = (frap.folio || '').toLowerCase();
    return nombre.includes(searchLower) || folio.includes(searchLower);
  });
  
  return new Response(JSON.stringify(fraps), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// POST /api/fraps - Create FRAP
export async function onRequestPost(context) {
  const { request, env } = context;
  
  const user = await getUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ detail: "No autorizado" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const frapData = await request.json();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  // Auto-generate folio if not provided
  if (!frapData.folio || frapData.folio.trim() === '') {
    const { results } = await env.DB.prepare('SELECT next_folio FROM folio_sequence WHERE id = 1').all();
    const nextFolio = results[0]?.next_folio || 1000;
    frapData.folio = String(nextFolio);
    await env.DB.prepare('UPDATE folio_sequence SET next_folio = ? WHERE id = 1').bind(nextFolio + 1).run();
  } else {
    // Check if folio already exists
    const { results } = await env.DB.prepare('SELECT id FROM fraps WHERE folio = ?').bind(frapData.folio).all();
    if (results.length > 0) {
      return new Response(JSON.stringify({ 
        detail: `El folio ${frapData.folio} ya existe. Use otro número o deje vacío para asignar automáticamente.` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  await env.DB.prepare(
    'INSERT INTO fraps (id, folio, data, created_at, updated_at, created_by, created_by_name) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, frapData.folio, JSON.stringify(frapData), now, now, user.id, user.nombre).run();
  
  return new Response(JSON.stringify({
    id,
    created_at: now,
    updated_at: now,
    created_by: user.id,
    created_by_name: user.nombre,
    ...frapData
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
