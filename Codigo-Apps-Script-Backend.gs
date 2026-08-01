/**
 * INTENSA LENCERÍA — Backend compartido (Google Sheets)
 * -----------------------------------------------------------
 * Usa esta versión SOLO si vas a alojar la tienda como una web
 * aparte (Vercel/Netlify), no dentro de Claude — ahí sí funcionan
 * las conexiones externas.
 *
 * Cómo desplegarlo:
 * 1. Crea una Google Sheet vacía.
 * 2. Extensiones > Apps Script.
 * 3. Borra el contenido de Code.gs y pega TODO este archivo.
 * 4. Guarda.
 * 5. Implementar > Nueva implementación > Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Copia la URL que termina en /exec.
 * 7. Pégala como VITE_SHEETS_URL en tu proyecto (ver README.md).
 *
 * Crea automáticamente 3 hojas: Inventario, Pedidos, Config.
 */

const SHEETS = {
  products: { name: 'Inventario', headers: ['id', 'cat', 'name', 'color', 'tallas', 'price', 'stock', 'note', 'image', 'image2'] },
  orders: { name: 'Pedidos', headers: ['id', 'date', 'customer', 'phone', 'address', 'ref', 'items', 'total', 'status'] },
  config: { name: 'Config', headers: ['key', 'value'] },
};

function doGet(e) {
  const type = (e.parameter.type || '').toLowerCase();
  if (type === 'products') return jsonResponse_({ ok: true, data: readProducts_() });
  if (type === 'orders') return jsonResponse_({ ok: true, data: readOrders_() });
  if (type === 'config') return jsonResponse_({ ok: true, data: readConfig_() });
  return jsonResponse_({ ok: false, error: 'type inválido. Usa ?type=products|orders|config' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const type = (body.type || '').toLowerCase();
    if (type === 'products') { writeProducts_(body.data || []); return jsonResponse_({ ok: true }); }
    if (type === 'orders') { writeOrders_(body.data || []); return jsonResponse_({ ok: true }); }
    if (type === 'config') { writeConfig_(body.data || {}); return jsonResponse_({ ok: true }); }
    return jsonResponse_({ ok: false, error: 'type inválido' });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/* ---------- helpers de hoja ---------- */

function getSheet_(kind) {
  const conf = SHEETS[kind];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(conf.name);
  if (!sheet) {
    sheet = ss.insertSheet(conf.name);
    sheet.appendRow(conf.headers);
  }
  return sheet;
}

/* ---------- productos ---------- */

function readProducts_() {
  const sheet = getSheet_('products');
  const values = sheet.getDataRange().getValues();
  return values.slice(1)
    .filter(function (r) { return r[0] !== '' && r[0] !== null; })
    .map(function (r) {
      return {
        id: String(r[0]), cat: r[1], name: r[2], color: r[3],
        tallas: String(r[4] || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean),
        price: (r[5] === '' || r[5] === null) ? null : Number(r[5]),
        stock: Number(r[6]) || 0,
        note: r[7] || '',
        image: r[8] || null,
        image2: r[9] || null,
      };
    });
}

function writeProducts_(products) {
  const sheet = getSheet_('products');
  sheet.clearContents();
  sheet.appendRow(SHEETS.products.headers);
  const rows = products.map(function (p) {
    return [
      p.id, p.cat, p.name, p.color, (p.tallas || []).join(', '),
      (p.price === null || p.price === undefined) ? '' : p.price,
      p.stock, p.note || '', p.image || '', p.image2 || '',
    ];
  });
  if (rows.length) sheet.getRange(2, 1, rows.length, SHEETS.products.headers.length).setValues(rows);
}

/* ---------- pedidos ---------- */

function readOrders_() {
  const sheet = getSheet_('orders');
  const values = sheet.getDataRange().getValues();
  return values.slice(1)
    .filter(function (r) { return r[0] !== '' && r[0] !== null; })
    .map(function (r) {
      return {
        id: String(r[0]), date: r[1], customer: r[2], phone: r[3], address: r[4],
        ref: r[5], items: JSON.parse(r[6] || '[]'), total: Number(r[7]) || 0, status: r[8],
      };
    });
}

function writeOrders_(orders) {
  const sheet = getSheet_('orders');
  sheet.clearContents();
  sheet.appendRow(SHEETS.orders.headers);
  const rows = orders.map(function (o) {
    return [o.id, o.date, o.customer, o.phone, o.address, o.ref || '', JSON.stringify(o.items || []), o.total, o.status];
  });
  if (rows.length) sheet.getRange(2, 1, rows.length, SHEETS.orders.headers.length).setValues(rows);
}

/* ---------- configuración (QR, nota bancaria, PIN) ---------- */

function readConfig_() {
  const sheet = getSheet_('config');
  const values = sheet.getDataRange().getValues();
  const conf = {};
  values.slice(1).forEach(function (r) { if (r[0]) conf[r[0]] = String(r[1]); });
  return conf;
}

function writeConfig_(conf) {
  const sheet = getSheet_('config');
  sheet.clearContents();
  sheet.appendRow(SHEETS.config.headers);
  const rows = Object.keys(conf).map(function (k) { return [k, String(conf[k])]; });
  if (rows.length) {
    const range = sheet.getRange(2, 1, rows.length, 2);
    range.setNumberFormat('@'); // texto plano: evita que Sheets convierta números de teléfono, PIN, etc.
    range.setValues(rows);
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
