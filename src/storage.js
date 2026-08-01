// Adaptador de almacenamiento para la versión web (fuera de Claude).
// Lee/escribe en tu Google Apps Script Web App (backend en Sheets).
// Si no configuras VITE_SHEETS_URL, funciona solo con localStorage
// (útil para probar en tu computadora antes de desplegar).

const BASE_URL = import.meta.env.VITE_SHEETS_URL || '';

async function getRemote(type) {
  if (!BASE_URL) return null;
  try {
    const res = await fetch(`${BASE_URL}?type=${type}`);
    const text = await res.text();
    console.log(`[INTENSA-SYNC] GET ${type} → status ${res.status}`, text.slice(0, 300));
    if (!res.ok) return null;
    const data = JSON.parse(text);
    return data.ok ? data.data : null;
  } catch (e) {
    console.error(`[INTENSA-SYNC] Error leyendo ${type} desde el Sheet`, e);
    return null;
  }
}

async function setRemote(type, data) {
  if (!BASE_URL) return false;
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      // text/plain evita el preflight CORS que Apps Script no maneja bien
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, data }),
    });
    const text = await res.text();
    console.log(`[INTENSA-SYNC] POST ${type} → status ${res.status}`, text.slice(0, 300));
    const json = JSON.parse(text);
    return !!json.ok;
  } catch (e) {
    console.error(`[INTENSA-SYNC] Error guardando ${type} en el Sheet`, e);
    return false;
  }
}

function getLocal(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('No se pudo guardar en localStorage', e);
  }
}

export const storage = {
  isRemoteConfigured: !!BASE_URL,

  // Lectura instantánea desde el navegador (sin esperar al Sheet), para
  // pintar la pantalla al toque mientras los datos reales llegan detrás.
  getLocalProducts(fallback) { return getLocal('il_products', fallback); },
  getLocalOrders() { return getLocal('il_orders', []); },
  getLocalConfig() { return getLocal('il_config', {}); },

  async getProducts(fallback) {
    const remote = await getRemote('products');
    if (remote) { setLocal('il_products', remote); return remote; }
    return getLocal('il_products', fallback);
  },
  async saveProducts(products) {
    setLocal('il_products', products);
    return setRemote('products', products);
  },

  async getOrders() {
    const remote = await getRemote('orders');
    if (remote) { setLocal('il_orders', remote); return remote; }
    return getLocal('il_orders', []);
  },
  async saveOrders(orders) {
    setLocal('il_orders', orders);
    return setRemote('orders', orders);
  },

  async getConfig() {
    const remote = await getRemote('config');
    if (remote) { setLocal('il_config', remote); return remote; }
    return getLocal('il_config', {});
  },
  async saveConfig(config) {
    setLocal('il_config', config);
    return setRemote('config', config);
  },
};
