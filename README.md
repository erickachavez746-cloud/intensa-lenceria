# Intensa Lencería — Tienda web

App de catálogo + carrito + panel admin (inventario, pedidos, dashboard),
con inventario/pedidos/configuración sincronizados en vivo con un Google Sheet.

---

## 1. Backend en Google Sheets (una sola vez)

1. Crea una Google Sheet vacía.
2. Extensiones → Apps Script.
3. Borra el contenido de `Code.gs` y pega TODO el contenido de
   `Codigo-Apps-Script-Backend.gs` (incluido en esta carpeta).
4. Guarda.
5. Implementar → Nueva implementación → Aplicación web.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Autoriza los permisos cuando te lo pida (Avanzado → Ir al proyecto → Permitir).
7. Copia la URL que termina en `/exec`. La necesitas en el paso 3.

La primera vez que la app se conecte, crea automáticamente 3 hojas:
`Inventario`, `Pedidos` y `Config`.

---

## 2. Instalar y probar en tu computadora

Necesitas [Node.js](https://nodejs.org) instalado (versión 18 o más nueva).

```bash
cd intensa-lenceria-web
npm install
cp .env.example .env
```

Abre `.env` y pega la URL de tu Web App:

```
VITE_SHEETS_URL=https://script.google.com/macros/s/TU_ID/exec
```

Luego:

```bash
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).

---

## 3. Desplegar en Vercel (recomendado, gratis)

1. Sube esta carpeta a un repositorio de GitHub (puedes usar
   [GitHub Desktop](https://desktop.github.com) si no usas la terminal para git).
2. Ve a [vercel.com](https://vercel.com) → crea cuenta gratis (puedes entrar con GitHub).
3. **Add New → Project** → elige tu repositorio.
4. En **Environment Variables**, agrega:
   - Name: `VITE_SHEETS_URL`
   - Value: la URL de tu Web App (`.../exec`)
5. Deploy. En ~1 minuto te da un link tipo `intensa-lenceria.vercel.app`.
6. (Opcional) En **Settings → Domains** puedes conectar tu propio dominio.

### Alternativa: Netlify

Mismo proceso: conecta el repo, agrega la variable de entorno
`VITE_SHEETS_URL`, build command `npm run build`, publish directory `dist`.

---

## 4. Usar la app

- **Tienda**: se ve directo al abrir el link.
- **Panel admin**: mantén presionado el logo "Intensa" ~1 segundo → ingresa
  el PIN (por defecto `1234`, cámbialo en Configuración).
- Todo lo que cambies (inventario, precios, stock, fotos*, pedidos, QR de
  cobro) se guarda automáticamente en tu Google Sheet y lo ven todos los
  que abran el link.

\* Las fotos de producto sí viajan a la Sheet (columna `image`), pero
Google Sheets limita cada celda a 50,000 caracteres — con fotos muy
grandes podrías llegar al límite. Si ves errores al guardar un producto
con foto, prueba con una imagen más chica o pide que se comprima más
(hablando con Claude, puedo bajar la calidad de compresión en el código).

---

## 5. Si algo no sincroniza

- Revisa que `VITE_SHEETS_URL` esté bien escrita y termine en `/exec` (no `/dev`).
- Si editaste el código de Apps Script después del primer despliegue, debes
  crear una **nueva versión**: Implementar → Administrar implementaciones →
  editar (lápiz) → Versión "Nueva" → Implementar.
- Abre la URL de tu Web App directo en el navegador — debería mostrarte un
  error pidiendo `?type=products|orders|config` (eso confirma que está viva).
- Si no configuraste `VITE_SHEETS_URL`, la app sigue funcionando pero solo
  guarda los datos en el navegador de cada persona (no se comparte entre
  dispositivos).

---

## Estructura del proyecto

```
intensa-lenceria-web/
├── Codigo-Apps-Script-Backend.gs   ← pega esto en Google Apps Script
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx        ← toda la app (tienda + admin)
    ├── storage.js      ← conexión con el Sheet
    └── index.css
```
