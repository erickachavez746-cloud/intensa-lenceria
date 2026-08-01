import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, Package, BarChart3, Settings, Plus, Trash2, Check, X,
  QrCode, Minus, ChevronRight, Search, Store, ClipboardList, Upload,
  AlertCircle, ArrowLeft, Sparkles, MessageCircle
} from 'lucide-react';
import { storage } from './storage.js';
import { FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa6';

const DashboardTab = React.lazy(() => import('./DashboardTab.jsx'));

/* ---------------------------------------------------------------
   TOKENS
---------------------------------------------------------------- */
const C = {
  cream: '#F3EBE0',
  creamAlt: '#FBF7F1',
  brownDark: '#4A2E1A',
  brownMid: '#7A4B2A',
  rose: '#D98BA0',
  roseDeep: '#A73E5C',
  gold: '#A9824C',
  ink: '#2B2118',
  line: '#DDCBB4',
  white: '#FFFFFF',
  danger: '#B4423C',
  okBg: '#E7EFE2',
  okText: '#4C6B3C',
  pendBg: '#F6E9D2',
  pendText: '#8A5A20',
};

const SWATCH = {
  'Rosa': '#E38FAE', 'Gris': '#B9B2A6', 'Negro': '#2B2118', 'Azul tinta': '#3B4A6B',
  'Rosado': '#EFAFC4', 'Rosado con rayas': '#F2C4D3', 'Leopardo': '#A9793F',
  'Gris Jaspeado': '#B7B0A6', 'Fuscia': '#C0316E', 'Blanco': '#F2EFE8',
  'Beis': '#D8C3A5', 'Rosado con corazones y puntos negros': '#EFAFC4',
  'Azul marino': '#1F2B45', 'Rosadito': '#F4C6D3', 'Rojo': '#B5342F',
  'Lila': '#B79FD1', 'Miel': '#DFA23F', 'Calipso': '#6FC2B4',
  'Negro con puntos': '#2B2118', 'Negro con corazones': '#2B2118',
  'Rosado con puntos': '#EFAFC4',
};

const SCENT_COLOR = {
  'Coconut Passion': '#D9B98A', 'Bare Vanilla': '#EADFC2', 'Amber Romance': '#B5723A',
  'Pure Seduction': '#E6A6C0', 'Velvet Petals': '#D98BA0', 'Midnight Bloom': '#4A3B63',
};

const CATEGORIES = ['Todos', 'Brasieres', 'Bragas de algodón', 'Tanguita VS', 'Hilo VS', 'Tanguita Pink', 'Encaje VS', 'Cremas y Lociones Corporales'];

const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://www.instagram.com/intensa_.lenceria_?igsh=MmNlMjQzZmQ4OG4w', Icon: FaInstagram },
  { name: 'TikTok', url: 'https://www.tiktok.com/@intensa_.lenceria_?_r=1&_t=ZS-98X0TL667TW', Icon: FaTiktok },
  { name: 'Facebook', url: 'https://www.facebook.com/share/19NH12M1Hx/?mibextid=wwXIfr', Icon: FaFacebook },
];

// Si en el Sheet quedó guardado un nombre de categoría anterior (por ejemplo
// tras un renombre), lo traducimos automáticamente al nombre actual.
const CATEGORY_ALIASES = {
  'bodysplash y lociones': 'Cremas y Lociones Corporales',
};
function normalizeCategory(cat) {
  const key = String(cat || '').trim().toLowerCase();
  return CATEGORY_ALIASES[key] || cat;
}

/* ---------------------------------------------------------------
   SEED DATA (desde el catálogo de Intensa Lencería)
---------------------------------------------------------------- */
const SEED_PRODUCTS = [
  { id: 'p1', cat: 'Brasieres', name: 'Brasier VS BS340', color: 'Rosa', tallas: ['36B (M)'], price: null, stock: 1, note: 'Código BS340' },
  { id: 'p2', cat: 'Brasieres', name: 'Brasier VS BS340', color: 'Gris', tallas: ['38B (L)'], price: null, stock: 1, note: 'Código BS340' },
  { id: 'p3', cat: 'Bragas de algodón', name: 'Braga de algodón VS', color: 'Negro', tallas: ['M', 'L'], price: 115, stock: 2, note: 'Braguita de algodón con logotipo grande' },
  { id: 'p4', cat: 'Bragas de algodón', name: 'Braga de algodón VS', color: 'Azul tinta', tallas: ['L'], price: 115, stock: 1, note: 'Braguita de algodón con logotipo grande' },
  { id: 'p5', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Rosado con rayas', tallas: ['XS', 'S'], price: 115, stock: 2, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p6', cat: 'Tanguita VS', name: 'Braga VS', color: 'Rosado', tallas: ['S', 'M'], price: 115, stock: 2, note: 'Braguita de algodón con logotipo grande' },
  { id: 'p7', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Rosado', tallas: ['L'], price: 115, stock: 1, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p8', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Negro', tallas: ['XS', 'S', 'M', 'L'], price: 115, stock: 4, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p9', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Azul tinta', tallas: ['S', 'L'], price: 115, stock: 2, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p10', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Leopardo', tallas: ['S', 'L'], price: 115, stock: 2, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p11', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Gris Jaspeado', tallas: ['XS', 'S', 'M', 'L'], price: 115, stock: 4, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p12', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Fuscia', tallas: ['M'], price: 115, stock: 1, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p13', cat: 'Tanguita VS', name: 'Tanguita VS', color: 'Blanco', tallas: ['M'], price: 115, stock: 1, note: 'Tanguita de algodón con logotipo grande' },
  { id: 'p14', cat: 'Hilo VS', name: 'Hilo VS', color: 'Beis', tallas: ['S', 'M'], price: 115, stock: 2, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p15', cat: 'Hilo VS', name: 'Hilo VS', color: 'Fuscia', tallas: ['M'], price: 115, stock: 1, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p16', cat: 'Hilo VS', name: 'Hilo VS', color: 'Gris Jaspeado', tallas: ['S', 'M', 'L'], price: 115, stock: 3, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p17', cat: 'Hilo VS', name: 'Hilo VS', color: 'Rosado con corazones y puntos negros', tallas: ['L'], price: 115, stock: 1, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p18', cat: 'Hilo VS', name: 'Hilo VS', color: 'Negro', tallas: ['S'], price: 115, stock: 1, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p19', cat: 'Hilo VS', name: 'Hilo VS', color: 'Azul marino', tallas: ['S', 'L'], price: 115, stock: 2, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p20', cat: 'Hilo VS', name: 'Hilo VS', color: 'Rosadito', tallas: ['S'], price: 115, stock: 1, note: 'Braguita elástico con tanga en forma de V' },
  { id: 'p21', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Rosado', tallas: ['L'], price: 115, stock: 1, note: 'Micro tanga de algodón con logo' },
  { id: 'p22', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Rojo', tallas: ['M', 'L'], price: 115, stock: 2, note: 'Micro tanga de algodón con logo' },
  { id: 'p23', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Leopardo', tallas: ['S', 'M'], price: 115, stock: 2, note: 'Micro tanga de algodón con logo' },
  { id: 'p24', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Negro con puntos', tallas: ['M', 'L'], price: 115, stock: 2, note: 'Micro tanga de algodón con logo' },
  { id: 'p25', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Negro', tallas: ['S'], price: 115, stock: 1, note: 'Micro tanga de algodón con logo' },
  { id: 'p26', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Azul marino', tallas: ['S'], price: 115, stock: 1, note: 'Tanguita de algodón' },
  { id: 'p27', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Lila', tallas: ['S'], price: 115, stock: 1, note: 'Tanguita de algodón' },
  { id: 'p28', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Negro con corazones', tallas: ['S'], price: 115, stock: 1, note: 'Tanguita de algodón' },
  { id: 'p29', cat: 'Tanguita Pink', name: 'Tanguita Pink', color: 'Rosado con puntos', tallas: ['S'], price: 115, stock: 1, note: 'Tanguita de algodón' },
  { id: 'p30', cat: 'Encaje VS', name: 'Tanguita VS con encaje', color: 'Miel', tallas: ['S'], price: 90, stock: 1, note: 'Tanguita de algodón con ribete de encaje' },
  { id: 'p31', cat: 'Encaje VS', name: 'Tanguita VS con encaje', color: 'Lila', tallas: ['M'], price: 90, stock: 1, note: 'Tanguita de algodón con ribete de encaje' },
  { id: 'p32', cat: 'Encaje VS', name: 'Tanguita VS con encaje', color: 'Calipso', tallas: ['L'], price: 90, stock: 1, note: 'Tanguita de algodón con ribete de encaje' },
  { id: 'p33', cat: 'Encaje VS', name: 'Braguita de encaje VS', color: 'Fuscia', tallas: ['S'], price: 90, stock: 1, note: 'Braguita de encaje' },
  { id: 'f1', cat: 'Cremas y Lociones Corporales', name: 'Coconut Passion', color: 'Coconut Passion', tallas: ['250ml'], price: null, stock: 3, note: 'Aroma cremoso a coco y un toque dulce, tipo postre tropical.' },
  { id: 'f2', cat: 'Cremas y Lociones Corporales', name: 'Bare Vanilla', color: 'Bare Vanilla', tallas: ['250ml'], price: null, stock: 3, note: 'Vainilla suave, cálida y envolvente, un clásico delicado.' },
  { id: 'f3', cat: 'Cremas y Lociones Corporales', name: 'Amber Romance', color: 'Amber Romance', tallas: ['250ml'], price: null, stock: 3, note: 'Ámbar cálido con notas de cereza negra y crema, sensual y acogedor.' },
  { id: 'f4', cat: 'Cremas y Lociones Corporales', name: 'Pure Seduction', color: 'Pure Seduction', tallas: ['250ml'], price: null, stock: 3, note: 'Mezcla frutal dulce y envolvente, fresca y femenina.' },
  { id: 'f5', cat: 'Cremas y Lociones Corporales', name: 'Velvet Petals', color: 'Velvet Petals', tallas: ['250ml'], price: null, stock: 3, note: 'Floral dulce con notas de almendra y vainilla, suave y romántico.' },
  { id: 'f6', cat: 'Cremas y Lociones Corporales', name: 'Midnight Bloom', color: 'Midnight Bloom', tallas: ['250ml'], price: null, stock: 3, note: 'Floral amaderado, cremoso y sensual, ideal para la noche.' },
];

/* ---------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */
const bs = (n) => (n === null || n === undefined) ? 'Definir precio' : `Bs ${n.toFixed(0)}`;
const uid = () => Math.random().toString(36).slice(2, 10);

function swatchColor(p) {
  if (p.cat === 'Cremas y Lociones Corporales') return SCENT_COLOR[p.name] || C.gold;
  return SWATCH[p.color] || C.brownMid;
}

const CSV_COLUMNS = ['id', 'cat', 'name', 'color', 'tallas', 'price', 'stock', 'note'];

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function productsToCSV(products) {
  const header = CSV_COLUMNS.join(',');
  const rows = products.map((p) => [
    p.id, p.cat, p.name, p.color, (p.tallas || []).join('|'),
    p.price === null || p.price === undefined ? '' : p.price, p.stock, p.note || '',
  ].map(csvEscape).join(','));
  return [header, ...rows].join('\n');
}

function downloadCSV(products) {
  const csv = productsToCSV(products);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventario-intensa-lenceria.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  const rows = lines.map((line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQuotes) {
        if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = false; }
        else cur += c;
      } else if (c === '"') inQuotes = true;
      else if (c === ',') { result.push(cur); cur = ''; }
      else cur += c;
    }
    result.push(cur);
    return result;
  });
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj = {};
    header.forEach((h, i) => { obj[h] = r[i]; });
    return obj;
  });
}

function csvRowsToProducts(rows) {
  return rows
    .filter((r) => r.name)
    .map((r) => ({
      id: r.id && r.id.trim() ? r.id.trim() : uid(),
      cat: r.cat || 'Tanguita VS',
      name: r.name,
      color: r.color || '',
      tallas: (r.tallas || '').split('|').map((t) => t.trim()).filter(Boolean),
      price: r.price === '' || r.price === undefined ? null : Number(r.price),
      stock: Number(r.stock) || 0,
      note: r.note || '',
    }));
}

// Las fotos no viajan en el CSV (son demasiado pesadas para una hoja de
// cálculo), así que al importar las conservamos comparando por id.
function mergeImages(incomingProducts, currentProducts) {
  const imageMap = {};
  (currentProducts || []).forEach((p) => {
    if (p.image || p.image2) imageMap[p.id] = { image: p.image, image2: p.image2 };
  });
  return incomingProducts.map((p) => (imageMap[p.id] ? { ...p, ...imageMap[p.id] } : p));
}

// Google Sheets limita cada celda a 50,000 caracteres. Dejamos buen margen
// e intentamos progresivamente con menos calidad/tamaño hasta que quepa.
const MAX_IMAGE_CHARS = 38000;

function drawToDataURL(img, maxWidth, quality) {
  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const attempts = [
          [420, 0.68], [340, 0.6], [280, 0.5], [220, 0.45], [180, 0.4], [140, 0.35],
        ];
        let result = null;
        for (const [w, q] of attempts) {
          const candidate = drawToDataURL(img, w, q);
          if (candidate.length <= MAX_IMAGE_CHARS) { result = candidate; break; }
          result = candidate; // guarda el último intento por si ninguno entra
        }
        if (result.length > MAX_IMAGE_CHARS) {
          reject(new Error('La foto sigue siendo muy pesada incluso comprimida al máximo. Prueba con otra foto (idealmente ya recortada de cerca al producto).'));
          return;
        }
        resolve(result);
      };
      img.onerror = () => reject(new Error('No se pudo leer esa imagen.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('No se pudo leer ese archivo.'));
    reader.readAsDataURL(file);
  });
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: C.line }} />
      <Sparkles size={13} style={{ color: C.gold }} />
      <div className="flex-1 h-px" style={{ background: C.line }} />
    </div>
  );
}

function Logo({ size = 'md' }) {
  const big = size === 'lg';
  return (
    <div className="flex flex-col items-center">
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: big ? 40 : 22,
          color: C.brownDark,
          lineHeight: 1,
        }}
      >
        Intensa
      </span>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 600,
          letterSpacing: big ? 6 : 3,
          fontSize: big ? 22 : 12,
          color: C.brownDark,
        }}
      >
        LENCERÍA
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------
   MAIN APP
---------------------------------------------------------------- */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [qrImage, setQrImage] = useState(null);
  const [bankNote, setBankNote] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [adminPin, setAdminPin] = useState('1234');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [csvStatus, setCsvStatus] = useState(null); // {ok, msg}

  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  const handleLogoDown = () => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setView('admin');
      if (!adminUnlocked) { setPinInput(''); setPinError(false); }
    }, 700);
  };
  const handleLogoUp = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };
  const handleLogoClick = () => {
    if (longPressTriggered.current) { longPressTriggered.current = false; return; }
    setView('tienda');
    setAdminUnlocked(false);
  };

  const [view, setView] = useState('tienda'); // tienda | admin
  const [adminTab, setAdminTab] = useState('inventario'); // inventario | pedidos | dashboard | config
  const [cat, setCat] = useState('Todos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]); // {productId, talla, qty}
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(null);
  const [lastOrderWaLink, setLastOrderWaLink] = useState(null);
  const fileRef = useRef(null);

  /* ---------- load ---------- */
  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getProducts(SEED_PRODUCTS);
        const p = raw.map((prod) => ({ ...prod, cat: normalizeCategory(prod.cat) }));
        setProducts(p);
        const changed = raw.some((prod, i) => prod.cat !== p[i].cat);
        if (changed) storage.saveProducts(p); // corrige el Sheet en segundo plano

        const o = await storage.getOrders();
        setOrders(o);

        const conf = await storage.getConfig();
        if (conf) {
          setQrImage(conf.qrImage || null);
          setBankNote(conf.bankNote || '');
          setWhatsapp(conf.whatsapp || '');
          setAdminPin(conf.adminPin || '1234');
        }
      } catch (e) {
        console.error('Error cargando datos', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveProducts = async (next) => {
    setProducts(next);
    const ok = await storage.saveProducts(next);
    if (!ok && storage.isRemoteConfigured) {
      setCsvStatus({ ok: false, msg: 'No se pudo guardar en el Sheet (revisa la URL/permisos). Se guardó localmente.' });
    }
    return ok;
  };

  const exportInventoryCSV = () => {
    downloadCSV(products);
    setCsvStatus({ ok: true, msg: 'CSV descargado. Impórtalo en Google Sheets: Archivo → Importar.' });
  };

  const importInventoryCSV = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const rows = parseCSV(String(reader.result));
        const parsed = csvRowsToProducts(rows);
        if (parsed.length === 0) {
          setCsvStatus({ ok: false, msg: 'El archivo no tiene productos válidos.' });
          return;
        }
        const merged = mergeImages(parsed, products);
        await saveProducts(merged);
        setCsvStatus({ ok: true, msg: `Inventario actualizado: ${parsed.length} productos importados.` });
      } catch (e) {
        console.error('Error importando CSV', e);
        setCsvStatus({ ok: false, msg: 'No se pudo leer ese archivo. Revisa que sea el CSV exportado desde aquí o desde Sheets con las mismas columnas.' });
      }
    };
    reader.readAsText(file);
  };

  const saveOrders = async (next) => {
    setOrders(next);
    await storage.saveOrders(next);
  };

  const saveConfig = async (next) => {
    await storage.saveConfig(next);
  };

  /* ---------- cart ---------- */
  const addToCart = (product, talla) => {
    setCart((c) => {
      const existing = c.find((i) => i.productId === product.id && i.talla === talla);
      if (existing) {
        return c.map((i) => i === existing ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...c, { productId: product.id, talla, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (productId, talla, delta) => {
    setCart((c) => c
      .map((i) => (i.productId === productId && i.talla === talla) ? { ...i, qty: i.qty + delta } : i)
      .filter((i) => i.qty > 0));
  };

  const removeFromCart = (productId, talla) => {
    setCart((c) => c.filter((i) => !(i.productId === productId && i.talla === talla)));
  };

  const cartDetailed = cart.map((i) => {
    const p = products.find((x) => x.id === i.productId);
    return { ...i, product: p };
  }).filter((i) => i.product);

  const cartTotal = cartDetailed.reduce((sum, i) => sum + (i.product.price || 0) * i.qty, 0);

  /* ---------- checkout ---------- */
  const submitOrder = async (form) => {
    const items = cartDetailed.map((i) => ({
      productId: i.productId, name: i.product.name, color: i.product.color,
      cat: i.product.cat, talla: i.talla, qty: i.qty, price: i.product.price || 0,
    }));

    const nextProducts = products.map((p) => {
      const inCart = cart.filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty, 0);
      if (inCart > 0) return { ...p, stock: Math.max(0, p.stock - inCart) };
      return p;
    });
    await saveProducts(nextProducts);

    const order = {
      id: uid(),
      date: new Date().toISOString(),
      customer: form.name,
      phone: form.phone,
      address: form.address,
      location: form.location || null, // {lat, lng} si eligió ubicación en el mapa
      ref: form.ref,
      items,
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      status: 'pendiente',
    };
    await saveOrders([order, ...orders]);

    const waDigits = (whatsapp || '').replace(/[^0-9]/g, '');
    if (waDigits) {
      const lines = [
        `Nuevo pedido de ${order.customer} (${order.phone})`,
        ...items.map((i) => `• ${i.name} (${i.color}) talla ${i.talla} x${i.qty} - Bs ${(i.price * i.qty).toFixed(0)}`),
        `Total: Bs ${order.total.toFixed(0)}`,
        order.address ? `Dirección: ${order.address}` : null,
        order.location ? `Ubicación GPS: https://maps.google.com/?q=${order.location.lat},${order.location.lng}` : null,
      ].filter(Boolean);
      setLastOrderWaLink(`https://wa.me/${waDigits}?text=${encodeURIComponent(lines.join('\n'))}`);
    } else {
      setLastOrderWaLink(null);
    }

    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setConfirmMsg('¡Pedido registrado! Verificaremos tu pago y confirmaremos tu compra.');
    setTimeout(() => { setConfirmMsg(null); setLastOrderWaLink(null); }, 12000);
  };

  const confirmOrder = async (orderId) => {
    await saveOrders(orders.map((o) => o.id === orderId ? { ...o, status: 'confirmado' } : o));
  };

  const cancelOrder = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status !== 'cancelado') {
      const restored = products.map((p) => {
        const item = order.items.find((it) => it.productId === p.id && it.talla);
        const totalQty = order.items.filter((it) => it.productId === p.id).reduce((s, it) => s + it.qty, 0);
        if (totalQty > 0) return { ...p, stock: p.stock + totalQty };
        return p;
      });
      await saveProducts(restored);
    }
    await saveOrders(orders.map((o) => o.id === orderId ? { ...o, status: 'cancelado' } : o));
  };

  /* ---------- inventory admin ---------- */
  const updateProduct = async (id, patch) => {
    return saveProducts(products.map((p) => p.id === id ? { ...p, ...patch } : p));
  };
  const deleteProduct = async (id) => {
    await saveProducts(products.filter((p) => p.id !== id));
  };
  const addProduct = async (p) => {
    await saveProducts([{ ...p, id: uid() }, ...products]);
  };

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setQrImage(reader.result);
      await saveConfig({ qrImage: reader.result, bankNote, adminPin, whatsapp });
    };
    reader.readAsDataURL(file);
  };

  /* ---------- derived: dashboard ---------- */
  const confirmedOrders = orders.filter((o) => o.status === 'confirmado');
  const pendingOrders = orders.filter((o) => o.status === 'pendiente');
  const totalRevenue = confirmedOrders.reduce((s, o) => s + o.total, 0);

  const productSales = {};
  confirmedOrders.forEach((o) => o.items.forEach((it) => {
    const key = `${it.name} (${it.color})`;
    productSales[key] = (productSales[key] || 0) + it.qty;
  }));
  const topProducts = Object.entries(productSales)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6);

  const catSales = {};
  confirmedOrders.forEach((o) => o.items.forEach((it) => {
    catSales[it.cat] = (catSales[it.cat] || 0) + it.qty * it.price;
  }));
  const catPie = Object.entries(catSales).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = [C.rose, C.gold, C.brownMid, C.roseDeep, C.brownDark, '#8CA37D'];

  const filteredProducts = products.filter((p) => {
    const matchCat = cat === 'Todos' || p.cat === cat;
    const matchSearch = search.trim() === '' ||
      (p.name + ' ' + p.color).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  /* ---------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.cream }}>
        <Logo size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.cream, fontFamily: "'Poppins', sans-serif", color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600;1,700&family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input, select, textarea, button { font-family: 'Poppins', sans-serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 8px; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-30" style={{ background: C.creamAlt, borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onPointerDown={handleLogoDown}
            onPointerUp={handleLogoUp}
            onPointerLeave={handleLogoUp}
            onClick={handleLogoClick}
            className="flex items-center gap-2 select-none"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            <Logo />
          </button>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setView('tienda')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition"
              style={{
                background: view === 'tienda' ? C.brownDark : 'transparent',
                color: view === 'tienda' ? C.creamAlt : C.brownDark,
              }}
            >
              <Store size={16} /> Tienda
            </button>
            {view === 'tienda' && (
              <>
                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                  {SOCIAL_LINKS.map(({ name, url, Icon }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: C.cream, color: C.brownDark }}
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium ml-1"
                  style={{ background: C.rose, color: C.white }}
                >
                  <ShoppingBag size={16} />
                  {cart.length > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center"
                      style={{ background: C.roseDeep, color: C.white }}
                    >
                      {cart.reduce((s, i) => s + i.qty, 0)}
                    </span>
                  )}
                </button>
              </>
            )}
          </nav>
        </div>
        {view === 'tienda' && (
          <div className="sm:hidden flex items-center justify-center gap-3 pb-2.5">
            {SOCIAL_LINKS.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: C.cream, color: C.brownDark }}
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        )}
      </header>

      {confirmMsg && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg text-sm" style={{ background: C.okBg, color: C.okText }}>
            <div className="flex items-center gap-2">
              <Check size={16} /> {confirmMsg}
            </div>
            {lastOrderWaLink && (
              <a
                href={lastOrderWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <MessageCircle size={14} /> Avisar por WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {view === 'tienda' ? (
        <StoreView
          products={filteredProducts}
          cat={cat} setCat={setCat}
          search={search} setSearch={setSearch}
          onAdd={addToCart}
          whatsapp={whatsapp}
        />
      ) : !adminUnlocked ? (
        <div className="max-w-sm mx-auto px-4 py-16 text-center">
          <Logo />
          <p className="text-sm mt-4 mb-4 opacity-70">Ingresa el PIN del panel admin</p>
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { if (pinInput === adminPin) setAdminUnlocked(true); else setPinError(true); } }}
            className="w-full text-center tracking-[0.4em] px-3 py-3 rounded-full text-lg outline-none mb-3"
            style={{ background: C.creamAlt, border: `1px solid ${pinError ? C.danger : C.line}` }}
            placeholder="••••"
          />
          {pinError && <p className="text-xs mb-3" style={{ color: C.danger }}>PIN incorrecto</p>}
          <button
            onClick={() => { if (pinInput === adminPin) setAdminUnlocked(true); else setPinError(true); }}
            className="px-6 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: C.brownDark, color: C.creamAlt }}
          >
            Entrar
          </button>
          <p className="text-[11px] opacity-50 mt-6">PIN por defecto: 1234. Cámbialo en Configuración una vez dentro.</p>
        </div>
      ) : (
        <AdminView
          adminTab={adminTab} setAdminTab={setAdminTab}
          products={products}
          orders={orders}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onAddProduct={addProduct}
          onConfirmOrder={confirmOrder}
          onCancelOrder={cancelOrder}
          totalRevenue={totalRevenue}
          pendingCount={pendingOrders.length}
          topProducts={topProducts}
          catPie={catPie}
          pieColors={PIE_COLORS}
          qrImage={qrImage}
          bankNote={bankNote}
          setBankNote={setBankNote}
          onQrUpload={handleQrUpload}
          onSaveBankNote={() => saveConfig({ qrImage, bankNote, adminPin, whatsapp })}
          adminPin={adminPin}
          setAdminPin={setAdminPin}
          onSavePin={(newPin) => { setAdminPin(newPin); saveConfig({ qrImage, bankNote, adminPin: newPin, whatsapp }); }}
          whatsapp={whatsapp}
          setWhatsapp={setWhatsapp}
          onSaveWhatsapp={(newWa) => { setWhatsapp(newWa); saveConfig({ qrImage, bankNote, adminPin, whatsapp: newWa }); }}
          csvStatus={csvStatus}
          onExportCSV={exportInventoryCSV}
          onImportCSV={importInventoryCSV}
        />
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: 'rgba(43,33,24,0.4)' }} onClick={() => setCartOpen(false)}>
          <div className="w-full max-w-md h-full overflow-y-auto p-5" style={{ background: C.creamAlt }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.brownDark }}>Tu carrito</h2>
              <button onClick={() => setCartOpen(false)}><X size={20} /></button>
            </div>
            {cartDetailed.length === 0 ? (
              <p className="text-sm opacity-70">Tu carrito está vacío. Explora el catálogo y agrega tus favoritos.</p>
            ) : (
              <>
                <div className="space-y-3">
                  {cartDetailed.map((i) => (
                    <div key={i.productId + i.talla} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: C.cream }}>
                      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden" style={{ background: swatchColor(i.product) }}>
                        {i.product.image && <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{i.product.name}</p>
                        <p className="text-xs opacity-70">{i.product.color} · Talla {i.talla}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: C.roseDeep }}>{bs(i.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => changeQty(i.productId, i.talla, -1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.line }}><Minus size={12} /></button>
                        <span className="text-sm w-4 text-center">{i.qty}</span>
                        <button onClick={() => changeQty(i.productId, i.talla, 1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.line }}><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(i.productId, i.talla)}><Trash2 size={15} style={{ color: C.danger }} /></button>
                    </div>
                  ))}
                </div>
                <Divider />
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-semibold" style={{ color: C.roseDeep }}>Bs {cartTotal.toFixed(0)}</span>
                </div>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: C.brownDark, color: C.creamAlt }}
                >
                  Ir a pagar <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <CheckoutModal
          total={cartTotal}
          qrImage={qrImage}
          bankNote={bankNote}
          onClose={() => setCheckoutOpen(false)}
          onSubmit={submitOrder}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   STORE VIEW
---------------------------------------------------------------- */
function StoreView({ products, cat, setCat, search, setSearch, onAdd, whatsapp }) {
  const waDigits = (whatsapp || '').replace(/[^0-9]/g, '');
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {waDigits && (
        <a
          href={`https://wa.me/${waDigits}?text=${encodeURIComponent('Hola, quiero consultar sobre un producto de Intensa Lencería')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg"
          style={{ background: '#25D366', color: '#fff' }}
        >
          <MessageCircle size={20} />
          <span className="text-sm font-semibold hidden sm:inline">Escríbenos</span>
        </a>
      )}
      <div className="text-center mb-6">
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 15, color: C.brownMid }}>
          Lencería Victoria's Secret &amp; Pink · Cremas y lociones corporales
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por color o producto..."
            className="w-full pl-9 pr-3 py-2.5 rounded-full text-sm outline-none"
            style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition"
            style={{
              background: cat === c ? C.roseDeep : C.creamAlt,
              color: cat === c ? C.white : C.brownDark,
              border: `1px solid ${cat === c ? C.roseDeep : C.line}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-sm opacity-60 py-16">No hay productos en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
        </div>
      )}

      <SocialFooter />
    </div>
  );
}

function SocialFooter() {
  return (
    <div className="mt-16 pt-8 pb-4 text-center" style={{ borderTop: `1px solid ${C.line}` }}>
      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.brownMid }}>
        Síguenos en nuestras redes
      </p>
      <div className="flex items-center justify-center gap-4">
        {SOCIAL_LINKS.map(({ name, url, Icon }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="w-10 h-10 rounded-full flex items-center justify-center transition"
            style={{ background: C.creamAlt, border: `1px solid ${C.line}`, color: C.brownDark }}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const [talla, setTalla] = useState(product.tallas[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const outOfStock = product.stock <= 0;
  const images = [product.image, product.image2].filter(Boolean);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
      <div className="h-28 flex items-center justify-center overflow-hidden relative" style={{ background: swatchColor(product) + '33' }}>
        {images.length > 0 ? (
          <button
            onClick={() => setLightboxOpen(true)}
            className="w-full h-full flex items-center justify-center"
            aria-label="Ver foto completa"
          >
            <img src={images[activeImg]} alt={product.name} className="max-w-full max-h-full object-contain" />
          </button>
        ) : (
          <div className="w-14 h-14 rounded-full" style={{ background: swatchColor(product) }} />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === activeImg ? C.roseDeep : C.line }}
              />
            ))}
          </div>
        )}
      </div>
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(43,33,24,0.85)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: C.creamAlt }}
          >
            <X size={18} style={{ color: C.brownDark }} />
          </button>
          <img
            src={images[activeImg]}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: i === activeImg ? C.roseDeep : C.creamAlt }}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold leading-tight" style={{ color: C.brownDark }}>{product.name}</p>
        <p className="text-xs opacity-70 mb-2">{product.color}</p>
        {product.note && <p className="text-[11px] opacity-60 mb-2 line-clamp-2">{product.note}</p>}

        {product.tallas.length > 1 ? (
          <select
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            className="text-xs mb-2 px-2 py-1.5 rounded-md outline-none"
            style={{ background: C.cream, border: `1px solid ${C.line}` }}
          >
            {product.tallas.map((t) => <option key={t} value={t}>Talla {t}</option>)}
          </select>
        ) : (
          <p className="text-xs mb-2 opacity-70">Talla {product.tallas[0]}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-sm font-bold" style={{ color: C.roseDeep }}>{bs(product.price)}</span>
          <button
            disabled={outOfStock || product.price === null}
            onClick={() => onAdd(product, talla)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full disabled:opacity-40"
            style={{ background: C.brownDark, color: C.creamAlt }}
          >
            {outOfStock ? 'Agotado' : 'Agregar'}
          </button>
        </div>
        {product.stock > 0 && product.stock <= 1 && (
          <p className="text-[10px] mt-1" style={{ color: C.pendText }}>¡Última unidad!</p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   CHECKOUT MODAL
---------------------------------------------------------------- */
const LocationPicker = React.lazy(() => import('./LocationPicker.jsx'));

function CheckoutModal({ total, qrImage, bankNote, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', ref: '', location: null });
  const canSubmit = form.name.trim() && form.phone.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(43,33,24,0.5)' }}>
      <div className="w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-y-auto" style={{ background: C.creamAlt }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.brownDark }}>Confirmar pedido</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="rounded-xl p-4 mb-4 text-center" style={{ background: C.cream }}>
          <p className="text-xs opacity-70 mb-2">Escanea el QR o transfiere el total</p>
          {qrImage ? (
            <img src={qrImage} alt="QR de pago" className="w-40 h-40 object-contain mx-auto rounded-lg" />
          ) : (
            <div className="w-40 h-40 mx-auto rounded-lg flex items-center justify-center" style={{ background: C.line }}>
              <QrCode size={40} style={{ color: C.brownMid }} />
            </div>
          )}
          {bankNote && <p className="text-xs mt-2 opacity-70 whitespace-pre-line">{bankNote}</p>}
          <p className="text-lg font-bold mt-2" style={{ color: C.roseDeep }}>Total: Bs {total.toFixed(0)}</p>
        </div>

        <div className="space-y-2.5">
          <input placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input placeholder="WhatsApp / celular" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input placeholder="Dirección o punto de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input placeholder="N° de referencia del comprobante (opcional)" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: C.cream, border: `1px solid ${C.line}` }} />

          <React.Suspense fallback={<p className="text-xs opacity-60 text-center py-4">Cargando mapa...</p>}>
            <LocationPicker value={form.location} onChange={(loc) => setForm({ ...form, location: loc })} />
          </React.Suspense>
        </div>

        <div className="flex items-start gap-2 mt-3 text-[11px] opacity-70">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <p>Tu pedido queda pendiente hasta que confirmemos tu pago. Envíanos tu comprobante por WhatsApp si prefieres.</p>
        </div>

        <button
          disabled={!canSubmit}
          onClick={() => onSubmit(form)}
          className="w-full mt-4 py-3 rounded-full text-sm font-semibold disabled:opacity-40"
          style={{ background: C.roseDeep, color: C.white }}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ADMIN VIEW
---------------------------------------------------------------- */
function AdminView(props) {
  const { adminTab, setAdminTab } = props;
  const tabs = [
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id)}
              className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: adminTab === t.id ? C.brownDark : C.creamAlt,
                color: adminTab === t.id ? C.creamAlt : C.brownDark,
                border: `1px solid ${adminTab === t.id ? C.brownDark : C.line}`,
              }}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {adminTab === 'inventario' && <InventoryTab {...props} />}
      {adminTab === 'pedidos' && <OrdersTab {...props} />}
      {adminTab === 'dashboard' && (
        <React.Suspense fallback={<p className="text-sm opacity-60">Cargando dashboard...</p>}>
          <DashboardTab {...props} />
        </React.Suspense>
      )}
      {adminTab === 'config' && <ConfigTab {...props} />}
    </div>
  );
}

function SingleImageSlot({ product, field, label, onUpdateProduct }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const currentImage = product[field];

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await resizeImageFile(file);
      const ok = await onUpdateProduct(product.id, { [field]: dataUrl });
      if (!ok) setError('No se guardó en el Sheet. Intenta de nuevo.');
    } catch (err) {
      console.error('Error procesando imagen', err);
      setError(err.message || 'No se pudo procesar esa imagen.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="relative flex-shrink-0">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: currentImage ? 'transparent' : swatchColor(product), border: `1px solid ${error ? C.danger : C.line}` }}
        title={label}
      >
        {busy ? (
          <span className="text-[9px]">...</span>
        ) : currentImage ? (
          <img src={currentImage} alt={label} className="w-full h-full object-cover" />
        ) : (
          <Upload size={12} style={{ color: C.white }} />
        )}
      </button>
      <span
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-1 rounded"
        style={{ background: C.brownDark, color: C.creamAlt }}
      >
        {field === 'image' ? '1' : '2'}
      </span>
      {error && (
        <p className="absolute top-9 left-0 w-40 text-[10px] z-10 px-1.5 py-1 rounded-md" style={{ background: C.creamAlt, color: C.danger, border: `1px solid ${C.danger}` }}>
          {error}
        </p>
      )}
      {currentImage && (
        <button
          onClick={() => onUpdateProduct(product.id, { [field]: null })}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: C.danger }}
          title={`Quitar ${label.toLowerCase()}`}
        >
          <X size={9} style={{ color: C.white }} />
        </button>
      )}
    </div>
  );
}

function ProductThumbUpload({ product, onUpdateProduct }) {
  return (
    <div className="flex items-center gap-2.5 pb-1">
      <SingleImageSlot product={product} field="image" label="Anverso" onUpdateProduct={onUpdateProduct} />
      <SingleImageSlot product={product} field="image2" label="Reverso" onUpdateProduct={onUpdateProduct} />
    </div>
  );
}

function InventoryTab({ products, onUpdateProduct, onDeleteProduct, onAddProduct }) {
  const [showForm, setShowForm] = useState(false);
  const [newP, setNewP] = useState({ cat: 'Tanguita VS', name: '', color: '', tallas: '', price: '', stock: 1, note: '' });

  const submitNew = () => {
    if (!newP.name.trim()) return;
    onAddProduct({
      ...newP,
      price: newP.price === '' ? null : Number(newP.price),
      stock: Number(newP.stock) || 0,
      tallas: newP.tallas.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setNewP({ cat: 'Tanguita VS', name: '', color: '', tallas: '', price: '', stock: 1, note: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.brownDark }}>Inventario ({products.length})</h2>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold" style={{ background: C.roseDeep, color: C.white }}>
          <Plus size={14} /> Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
          <select value={newP.cat} onChange={(e) => setNewP({ ...newP, cat: e.target.value })} className="px-2 py-2 rounded-md text-xs" style={{ background: C.cream, border: `1px solid ${C.line}` }}>
            {CATEGORIES.filter((c) => c !== 'Todos').map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Nombre" value={newP.name} onChange={(e) => setNewP({ ...newP, name: e.target.value })} className="px-2 py-2 rounded-md text-xs" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input placeholder="Color / aroma" value={newP.color} onChange={(e) => setNewP({ ...newP, color: e.target.value })} className="px-2 py-2 rounded-md text-xs" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input placeholder="Tallas (separadas por coma)" value={newP.tallas} onChange={(e) => setNewP({ ...newP, tallas: e.target.value })} className="px-2 py-2 rounded-md text-xs" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input type="number" placeholder="Precio Bs" value={newP.price} onChange={(e) => setNewP({ ...newP, price: e.target.value })} className="px-2 py-2 rounded-md text-xs" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input type="number" placeholder="Stock" value={newP.stock} onChange={(e) => setNewP({ ...newP, stock: e.target.value })} className="px-2 py-2 rounded-md text-xs" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <input placeholder="Nota / descripción" value={newP.note} onChange={(e) => setNewP({ ...newP, note: e.target.value })} className="px-2 py-2 rounded-md text-xs col-span-2 sm:col-span-2" style={{ background: C.cream, border: `1px solid ${C.line}` }} />
          <button onClick={submitNew} className="px-3 py-2 rounded-md text-xs font-semibold" style={{ background: C.brownDark, color: C.creamAlt }}>Guardar</button>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: C.creamAlt }}>
                <th className="text-left p-2.5">Foto</th>
                <th className="text-left p-2.5">Nombre</th>
                <th className="text-left p-2.5">Color / aroma</th>
                <th className="text-left p-2.5">Categoría</th>
                <th className="text-left p-2.5">Tallas</th>
                <th className="text-left p-2.5">Nota</th>
                <th className="text-left p-2.5">Precio (Bs)</th>
                <th className="text-left p-2.5">Stock</th>
                <th className="p-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p.id} product={p} onUpdateProduct={onUpdateProduct} onDeleteProduct={onDeleteProduct} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, onUpdateProduct, onDeleteProduct }) {
  const [draft, setDraft] = useState({
    name: product.name,
    color: product.color,
    tallas: product.tallas.join(', '),
    note: product.note || '',
  });

  const commit = (field, value) => {
    if (field === 'tallas') {
      onUpdateProduct(product.id, { tallas: value.split(',').map((t) => t.trim()).filter(Boolean) });
    } else {
      onUpdateProduct(product.id, { [field]: value });
    }
  };

  const inputStyle = { background: C.cream, border: `1px solid ${C.line}` };

  return (
    <tr style={{ borderTop: `1px solid ${C.line}` }}>
      <td className="p-2.5">
        <ProductThumbUpload product={product} onUpdateProduct={onUpdateProduct} />
      </td>
      <td className="p-2.5">
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          onBlur={(e) => commit('name', e.target.value)}
          className="w-32 px-2 py-1 rounded-md"
          style={inputStyle}
        />
      </td>
      <td className="p-2.5">
        <input
          value={draft.color}
          onChange={(e) => setDraft({ ...draft, color: e.target.value })}
          onBlur={(e) => commit('color', e.target.value)}
          className="w-28 px-2 py-1 rounded-md"
          style={inputStyle}
        />
      </td>
      <td className="p-2.5">
        <select
          value={product.cat}
          onChange={(e) => onUpdateProduct(product.id, { cat: e.target.value })}
          className="px-2 py-1 rounded-md"
          style={inputStyle}
        >
          {CATEGORIES.filter((c) => c !== 'Todos').map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </td>
      <td className="p-2.5">
        <input
          value={draft.tallas}
          onChange={(e) => setDraft({ ...draft, tallas: e.target.value })}
          onBlur={(e) => commit('tallas', e.target.value)}
          placeholder="S, M, L"
          className="w-24 px-2 py-1 rounded-md"
          style={inputStyle}
        />
      </td>
      <td className="p-2.5">
        <input
          value={draft.note}
          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          onBlur={(e) => commit('note', e.target.value)}
          className="w-36 px-2 py-1 rounded-md"
          style={inputStyle}
        />
      </td>
      <td className="p-2.5">
        <input
          type="number"
          value={product.price ?? ''}
          placeholder="—"
          onChange={(e) => onUpdateProduct(product.id, { price: e.target.value === '' ? null : Number(e.target.value) })}
          className="w-20 px-2 py-1 rounded-md"
          style={inputStyle}
        />
      </td>
      <td className="p-2.5">
        <input
          type="number"
          value={product.stock}
          onChange={(e) => onUpdateProduct(product.id, { stock: Math.max(0, Number(e.target.value)) })}
          className="w-16 px-2 py-1 rounded-md"
          style={inputStyle}
        />
      </td>
      <td className="p-2.5">
        <button onClick={() => onDeleteProduct(product.id)}><Trash2 size={14} style={{ color: C.danger }} /></button>
      </td>
    </tr>
  );
}

function OrdersTab({ orders, onConfirmOrder, onCancelOrder }) {
  const statusStyle = (s) => s === 'confirmado'
    ? { background: C.okBg, color: C.okText }
    : s === 'cancelado'
    ? { background: '#F0E3E1', color: C.danger }
    : { background: C.pendBg, color: C.pendText };

  if (orders.length === 0) {
    return <p className="text-sm opacity-60 py-10 text-center">Aún no hay pedidos registrados.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl p-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold">{o.customer}</p>
              <p className="text-xs opacity-60">{o.phone} · {new Date(o.date).toLocaleString('es-BO')}</p>
              {o.address && <p className="text-xs opacity-60">{o.address}</p>}
              {o.ref && <p className="text-xs opacity-60">Ref. comprobante: {o.ref}</p>}
            </div>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase" style={statusStyle(o.status)}>{o.status}</span>
          </div>
          <div className="text-xs opacity-80 space-y-0.5 mb-2">
            {o.items.map((it, idx) => (
              <p key={idx}>· {it.name} ({it.color}) Talla {it.talla} × {it.qty} — Bs {(it.price * it.qty).toFixed(0)}</p>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: C.roseDeep }}>Total: Bs {o.total.toFixed(0)}</span>
            {o.status === 'pendiente' && (
              <div className="flex gap-2">
                <button onClick={() => onConfirmOrder(o.id)} className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: C.okText, color: C.white }}>
                  <Check size={12} /> Confirmar pago
                </button>
                <button onClick={() => onCancelOrder(o.id)} className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: C.danger, color: C.white }}>
                  <X size={12} /> Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfigTab({ qrImage, bankNote, setBankNote, onQrUpload, onSaveBankNote, adminPin, onSavePin, whatsapp, onSaveWhatsapp, csvStatus, onExportCSV, onImportCSV }) {
  const fileRef = useRef(null);
  const csvFileRef = useRef(null);
  const [pinField, setPinField] = useState(adminPin);
  const [pinSaved, setPinSaved] = useState(false);
  const [waField, setWaField] = useState(whatsapp);
  const [waSaved, setWaSaved] = useState(false);
  return (
    <div className="max-w-md">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.brownDark }} className="mb-4">Datos de pago</h2>
      <div className="rounded-xl p-4 mb-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-xs opacity-70 mb-2">QR de cobro (se mostrará en el checkout)</p>
        {qrImage && <img src={qrImage} alt="QR actual" className="w-32 h-32 object-contain rounded-lg mb-3" style={{ border: `1px solid ${C.line}` }} />}
        <input ref={fileRef} type="file" accept="image/*" onChange={onQrUpload} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full" style={{ background: C.brownDark, color: C.creamAlt }}>
          <Upload size={13} /> Subir imagen QR
        </button>
      </div>
      <div className="rounded-xl p-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-xs opacity-70 mb-2">Nota para el cliente (banco, número de cuenta, titular, etc.)</p>
        <textarea
          value={bankNote}
          onChange={(e) => setBankNote(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none mb-2"
          style={{ background: C.cream, border: `1px solid ${C.line}` }}
        />
        <button onClick={onSaveBankNote} className="text-xs font-semibold px-3 py-2 rounded-full" style={{ background: C.roseDeep, color: C.white }}>
          Guardar nota
        </button>
      </div>

      <div className="rounded-xl p-4 mt-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-xs opacity-70 mb-2">Número de WhatsApp para contacto directo</p>
        <p className="text-[11px] opacity-50 mb-2">Aparece como un botón flotante en la tienda. Escríbelo con código de país, solo números (ej: 59171234567).</p>
        <div className="flex gap-2">
          <input
            value={waField}
            onChange={(e) => { setWaField(e.target.value); setWaSaved(false); }}
            placeholder="59171234567"
            className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
            style={{ background: C.cream, border: `1px solid ${C.line}` }}
          />
          <button
            onClick={() => { onSaveWhatsapp(waField); setWaSaved(true); }}
            className="text-xs font-semibold px-3 py-2 rounded-full"
            style={{ background: C.brownDark, color: C.creamAlt }}
          >
            Guardar
          </button>
        </div>
        {waSaved && <p className="text-[11px] mt-2" style={{ color: C.okText }}>Número actualizado</p>}
      </div>

      <div className="rounded-xl p-4 mt-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-xs opacity-70 mb-2">PIN de acceso al panel admin</p>
        <p className="text-[11px] opacity-50 mb-2">Esto no es una contraseña segura, solo evita que alguien entre por accidente. No compartas este PIN públicamente.</p>
        <div className="flex gap-2">
          <input
            value={pinField}
            onChange={(e) => { setPinField(e.target.value); setPinSaved(false); }}
            className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
            style={{ background: C.cream, border: `1px solid ${C.line}` }}
          />
          <button
            onClick={() => { onSavePin(pinField); setPinSaved(true); }}
            className="text-xs font-semibold px-3 py-2 rounded-full"
            style={{ background: C.brownDark, color: C.creamAlt }}
          >
            Guardar PIN
          </button>
        </div>
        {pinSaved && <p className="text-[11px] mt-2" style={{ color: C.okText }}>PIN actualizado</p>}
      </div>

      <div className="rounded-xl p-4 mt-4" style={{ background: C.creamAlt, border: `1px solid ${C.line}` }}>
        <p className="text-xs opacity-70 mb-2">Sincronización con Google Sheets</p>
        {storage.isRemoteConfigured ? (
          <p className="text-[11px] mb-3" style={{ color: C.okText }}>
            ✓ Conectada. El inventario, los pedidos y esta configuración se guardan en vivo en tu Google Sheet.
          </p>
        ) : (
          <p className="text-[11px] opacity-50 mb-3">
            No hay conexión configurada (falta la variable <code>VITE_SHEETS_URL</code> al desplegar). Mientras tanto,
            todo se guarda solo en este navegador. Usa Exportar/Importar CSV como respaldo manual.
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full"
            style={{ background: C.brownDark, color: C.creamAlt }}
          >
            Exportar CSV
          </button>
          <input
            ref={csvFileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportCSV(f); e.target.value = ''; }}
            className="hidden"
          />
          <button
            onClick={() => csvFileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full"
            style={{ background: C.roseDeep, color: C.white }}
          >
            Importar CSV
          </button>
        </div>
        {csvStatus && (
          <p className="text-[11px] mt-2" style={{ color: csvStatus.ok ? C.okText : C.danger }}>{csvStatus.msg}</p>
        )}
      </div>
    </div>
  );
}
