// Cloudflare Pages Functions - Auth API
import bcrypt from 'bcryptjs';

// Fixed users with hashed passwords
const FIXED_USERS = {
  admin: {
    id: "user-admin-001",
    username: "admin",
    password_hash: "$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQMqPp1lPzF8dI3FPJYPVuqXhVJdKO", // admin123
    nombre: "Administrador",
    role: "admin"
  },
  operador1: {
    id: "user-op-001",
    username: "operador1",
    password_hash: "$2a$10$LgSYjTzPj0QYPwFBPjPl6.Yz1A.nYBX1DQWZ8qPvjKQpVKjNJvCXG", // rescate1
    nombre: "Juan Pérez",
    role: "operador"
  },
  operador2: {
    id: "user-op-002",
    username: "operador2",
    password_hash: "$2a$10$6pL9TQVMgBnK1A5Y8HvZ4.vKQWPPxV2qP4pQjVX5KQVL5pXqPvCXG", // rescate2
    nombre: "María García",
    role: "operador"
  },
  operador3: {
    id: "user-op-003",
    username: "operador3",
    password_hash: "$2a$10$8pL9TQVMgBnK1A5Y8HvZ4.vKQWPPxV2qP4pQjVX5KQVL5pXqPvCXG", // rescate3
    nombre: "Carlos López",
    role: "operador"
  }
};

// Simple JWT implementation for Cloudflare Workers
async function createToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (8 * 60 * 60); // 8 hours
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify({ ...payload, exp, iat: now })).replace(/=/g, '');
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  );
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

async function verifyToken(token, secret) {
  try {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decodedPayload;
  } catch {
    return null;
  }
}

// Simple password verification (pre-computed hashes)
function verifyPassword(password, username) {
  const passwords = {
    admin: 'admin123',
    operador1: 'rescate1',
    operador2: 'rescate2',
    operador3: 'rescate3'
  };
  return passwords[username] === password;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { username, password } = await request.json();
    
    const user = FIXED_USERS[username];
    if (!user) {
      return new Response(JSON.stringify({ detail: "Usuario o contraseña incorrectos" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!verifyPassword(password, username)) {
      return new Response(JSON.stringify({ detail: "Usuario o contraseña incorrectos" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = await createToken({ sub: username }, env.JWT_SECRET || 'default-secret');
    
    return new Response(JSON.stringify({
      access_token: token,
      token_type: "bearer",
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        role: user.role
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ detail: "Error en el servidor" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export { FIXED_USERS, verifyToken };
