import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { signToken, verifyToken, getUser, checkPassword, loadUsers } from "../server/auth.js";

const SECRET = "test-secret";

test("a signed token verifies and keeps its claims", async () => {
  const t = await signToken({ sub: "admin" }, SECRET);
  const p = await verifyToken(t, SECRET);
  assert.equal(p.sub, "admin");
});

test("a token signed with another secret is rejected", async () => {
  const t = await signToken({ sub: "admin" }, "other");
  assert.equal(await verifyToken(t, SECRET), null);
});

test("a token with an edited payload is rejected", async () => {
  const t = await signToken({ sub: "unidad1" }, SECRET);
  const [h, , s] = t.split(".");
  const forged = Buffer.from(JSON.stringify({ sub: "admin", exp: 9999999999 })).toString("base64url");
  assert.equal(await verifyToken(`${h}.${forged}.${s}`, SECRET), null);
});

test("an expired token is rejected", async () => {
  const t = await signToken({ sub: "admin" }, SECRET, 1000);
  assert.equal(await verifyToken(t, SECRET, 1000 + 9 * 3600), null);
});

test("getUser resolves the user from env and refuses without a secret", async () => {
  const env = {
    JWT_SECRET: SECRET,
    USERS: JSON.stringify([{ id: "u1", username: "unidad1", name: "Unidad 1", role: "operador", password_hash: bcrypt.hashSync("pw", 4) }]),
  };
  const t = await signToken({ sub: "unidad1" }, SECRET);
  const req = new Request("https://x/api", { headers: { Authorization: `Bearer ${t}` } });
  assert.equal((await getUser(req, env)).nombre, "Unidad 1");
  assert.equal(await getUser(req, { ...env, JWT_SECRET: undefined }), null);
  assert.ok(await checkPassword(loadUsers(env).unidad1, "pw"));
  assert.ok(!(await checkPassword(loadUsers(env).unidad1, "wrong")));
});
