// API Configuration & Base Gateway Endpoint
export const GATEWAY_URL = 'http://localhost:5500';

export async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${GATEWAY_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
