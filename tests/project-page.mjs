import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:8787";
let cookie = "";
async function call(path, options = {}) {
  const response = await fetch(base + path, { ...options, headers: { ...options.headers, ...(cookie ? { cookie } : {}) } });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return response;
}

const form = new FormData();
for (const [key, value] of Object.entries({
  title: "The Haunted Test Arcade", author: "Night Builders", description: "A playable test game",
  category: "Game", url: "https://example.com/game", mascot: "robot", members: "Boo, Hex",
  story: "We built a ghost maze together.", technologies: "React, Canvas", sourceUrl: "https://github.com/example/arcade",
})) form.set(key, value);

let response = await call("/api/projects", { method: "POST", body: form });
assert.equal(response.status, 201, await response.clone().text());
const { project } = await response.json();
assert.equal(project.story, "We built a ghost maze together.");
assert.equal(project.sourceUrl, "https://github.com/example/arcade");

response = await call(`/api/projects/${project.id}`);
assert.equal(response.status, 200);
const detail = (await response.json()).project;
assert.equal(detail.technologies, "React, Canvas");
assert.deepEqual(detail.mine, []);

response = await call(`/projects/${project.id}`);
assert.equal(response.status, 200);
const html = await response.text();
assert.match(html, /The Haunted Test Arcade/);
assert.match(html, /We built a ghost maze together/);
assert.match(html, /github\.com\/example\/arcade/);

response = await call(`/api/projects/${project.id}`, { method: "POST" });
assert.equal(response.status, 405);
response = await call("/api/projects/not-a-project");
assert.equal(response.status, 400);
console.log("PASS: submission metadata, direct project API and page, invalid project ID.");
