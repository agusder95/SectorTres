# SectorTres - F1 Companion 🏎️

Una aplicación web progresiva (PWA) para aficionados de Fórmula 1. Accede a información de carreras, resultados, standings y mucho más, directamente desde tu dispositivo.

## ✨ Características

- **📅 Calendario de Carreras**: Visualiza todas las carreras de la temporada
- **🏁 Resultados en Vivo**: Resultados completos, clasificación y sprint races
- **🏆 Campeonatos**: Standings de pilotos y constructores
- **❤️ Favoritos**: Guarda tus carreras y pilotos favoritos
- **🌙 Tema Oscuro/Claro**: Cambia entre temas según tu preferencia
- **📱 Responsive**: Diseño adaptado para móvil, tablet y desktop
- **⚡ PWA**: Instalable como app nativa, funciona offline
- **🚀 Rápido**: Precarga de datos y caching inteligente
- **🌍 Soporte MultiHora**: Hora 24h o AM/PM

## 🚀 Instalación

### Requisitos
- Node.js 16+
- npm o yarn

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/agusder95/SectorTres.git
cd SectorTres

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Buildear para producción
npm run build

# Previsualizar build en local
npm run preview
```

## 📖 Uso

### Desarrollo
```bash
npm run dev
```
Accede a `http://localhost:5173`

### Producción
```bash
npm run build
npm run preview
```

### Instalación como PWA
En tu navegador, busca el símbolo **"Instalar"** o el ícono de descarga en la barra de direcciones.

La app se instalará como una aplicación nativa en tu dispositivo.

## 🏗️ Estructura del Proyecto

```
f1-sectorTres/
├── public/              # Assets estáticos
│   ├── favicon.svg
│   ├── icon-192.png    # Ícono PWA
│   ├── icon-512.png
│   └── sw.js           # Service worker fallback
├── src/
│   ├── api/            # Servicios de API
│   │   ├── f1Service.js
│   │   └── circuitMapper.js
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── BottomNav.jsx
│   │   ├── PwaBanner.jsx
│   │   └── ...
│   ├── context/        # Context API
│   │   ├── LoadingContext.jsx
│   │   └── SeasonContext.jsx
│   ├── hooks/          # Custom hooks
│   │   └── useLocalStorage.js
│   ├── layouts/        # Layouts principales
│   │   └── MainLayout.jsx
│   ├── pages/          # Páginas de la app
│   │   ├── RacesPage.jsx
│   │   ├── ChampionshipsPage.jsx
│   │   ├── FavoritesPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── GPDetailsPage.jsx
│   ├── utils/          # Utilidades
│   │   └── timeFormatter.js
│   ├── constants/      # Constantes globales
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html          # HTML principal
├── vite.config.js      # Configuración Vite + PWA
├── tailwind.config.js  # Configuración Tailwind CSS
├── postcss.config.js
└── vercel.json         # Configuración Vercel

```

## 🛠️ Tecnologías

- **React 19** - Librería UI
- **Vite 5** - Bundler y dev server
- **React Router 7** - Enrutamiento
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **vite-plugin-pwa** - Soporte PWA
- **Workbox** - Service worker avanzado

## 🔌 API

La app utiliza **Jolpi API** (Ergast F1 API):
- Endpoint: `https://api.jolpi.ca/ergast/f1`
- Datos: Carreras, resultados, standings, pilotos, etc.

### Circuitos
Los SVG de circuitos se obtienen del repositorio:
- Fuente: `https://github.com/julesr0y/f1-assets`

### Equipos
Logos y colores de escuderías desde F1 Media:
- Fuente: `https://media.formula1.com/`

## 📱 PWA - Configuración

### Manifest
El archivo `manifest.webmanifest` se genera automáticamente en el build:
- Nombre: SectorTres - F1 Companion
- Ícono: 192x192 y 512x512 (maskable)
- Tema: Rojo F1 (#E10600)
- Instalable: Sí ✓

### Service Worker
- **Estrategia**: Workbox + generateSW
- **Caching**: 
  - API F1: NetworkFirst (24h)
  - Imágenes F1: CacheFirst (30d)
  - Circuitos: CacheFirst (30d)
- **Offline**: Soporte offline con caché

### Actualización
- Modo: **prompt** (el usuario decide cuándo actualizar)
- Banner: Notificación cuando hay nueva versión
- Recarga: Automática después de actualizar

## ⚙️ Configuración

### Tema
Los temas se guardan en `localStorage`:
- Clave: `f1-settings`
- Formato: `{ theme: 'dark' | 'light', use12h: boolean }`

### Favoritos
Se guardan en `localStorage`:
- Clave: `f1-favorites`
- Contenido: Array de carreras favoritas

## 🚀 Deploy en Vercel

El proyecto incluye configuración lista para Vercel:

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔄 Workflow de Desarrollo

1. **Desarrollo Local**
   ```bash
   npm run dev
   ```

2. **Build Producción**
   ```bash
   npm run build
   ```

3. **Testear Build**
   ```bash
   npm run preview
   ```

4. **Deploy**
   - Push a GitHub
   - Vercel redeploy automático

## 🎨 Temas

### Colores Principales
- Rojo F1: `#E10600`
- Fondo Oscuro: `#09090b`
- Blanco: `#ffffff`
- Gris: `#888888`

### Equipos
Colores por escudería mapeados en `src/constants/index.js`

## 📝 Variables de Entorno

Por defecto, no se necesitan variables de entorno. Todos los datos son públicos.

## 🐛 Troubleshooting

### El banner PWA aparece siempre
- Asegúrate de cerrar completamente el navegador
- Limpia el caché del sitio
- Recarga con Ctrl+Shift+R

### El service worker no actualiza
- Abre DevTools → Application → Service Workers
- Haz clic en "Unregister"
- Recarga la página
- Debería re-registrar el nuevo SW

### La app no carga datos
- Verifica tu conexión a internet
- Comprueba que `https://api.jolpi.ca/ergast/f1` esté disponible
- Abre DevTools → Network y ve si hay errores CORS


## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo LICENSE para más detalles.

## 🙏 Créditos

- **Datos de F1**: [Jolpi API](https://api.jolpi.ca/ergast/f1)
- **Circuitos SVG**: [julesr0y/f1-assets](https://github.com/julesr0y/f1-assets)
- **Logos F1**: [Formula1.com Media](https://media.formula1.com/) (En desarrollo)
- **Iconos**: [Lucide Icons](https://lucide.dev)

## 📞 Contacto

- Email: agustin.derobles1995@gmail.com
- GitHub: [@agusder95](https://github.com/agusder95)

---

**SectorTres** - Tu compañero de F1 en tu bolsillo 🏁

