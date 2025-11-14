const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function apiGet(endpoint: string) {
  const res = await fetch(`${baseUrl}${endpoint}`);
  if (!res.ok) throw new Error(`GET ${endpoint} failed`);
  return res.json();
}

export async function apiPost(endpoint: string, data: unknown) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed`);
  return res.json();
}
