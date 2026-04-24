# Project Specification: sectorTres (F1 Companion App)

## 🏎️ Visión General
sectorTres es una Progressive Web App (PWA) de alto rendimiento para entusiastas de la F1. El enfoque es minimalista, con transiciones suaves ("smooth vibes") y una arquitectura desacoplada por capas.

## 📱 Experiencia de Usuario (UX)
- **Navegación:** - **Mobile:** Bottom Navigation Bar con 4 puntos de entrada (Carreras, Campeonatos, Favoritos, Configuración).
    - **Desktop:** Navegación por pestañas superiores o lateral.
- **Feedback Visual:** Uso de colores de escudería sutiles en grillas, indicadores de estado de carrera (Finished, Live, Upcoming) y Skeleton Screens durante la carga.
- **Temas:** Soporte nativo para Dark/Light mode con cambio dinámico de assets (SVG outlines).

## 🛠️ Estructura de Secciones

### 1. Carreras (Main Page)
- **Filtro:** Selector de año (Season).
- **Cards de GP:** - Tipos: `Finalizada`, `Actual`, `Próxima`.
    - Contenido: Nombre GP, Fecha/Hora (ajustada a zona local), Imagen SVG del circuito.
    - Assets: SVGs dinámicos (Blanco para Dark, Negro para Light).

### 2. Campeonatos
- **Sub-pestañas:** Pilotos y Constructores.
- **Grilla:** Posición (Badge color Oro/Plata/Bronce para el podio), Nombre, Puntos.
- **Metadata:** Conteo de carreras restantes de la temporada.

### 3. Detalles del GP (Deep Dive)
- **Header:** Carrusel con imagen grande del circuito + miniaturas (SVG y Real-Photo Placeholder).
- **Sub-navegación:** Horarios, Tiempos, Puntos.
- **Lógica de Tiempos:**
    - **Qualy:** Marcadores visuales para Q1, Q2, Q3.
    - **Sprint:** Soporte para fines de semana con formato Sprint.
    - **DNF:** Filas en color gris opaco.
    - **Advertencia de Horario:** Badge de "Trasnoche/Madrugada" si el evento ocurre en un día calendario diferente al del usuario (ej. Sábado 02:00 am).

### 4. Favoritos
- Lista cronológica de GPs marcados.
- Acciones masivas: "Agregar todos los próximos" y "Limpiar favoritos" (con confirmación).

### 5. Configuración (Settings)
- Persistencia en `localStorage`.
- Opciones: Tema, Zona Horaria (País), Formato Hora (12h/24h), Botón "Destruir Datos".

## 🏗️ Requerimientos Técnicos & Capas
- **Capa de API:** Módulo `services/` dedicado a Fetch API consumiendo `api.jolpi.ca/ergast/`.
- **Capa de Constantes:** Mapeo de colores hexadecimales oficiales (2023-2026) y URLs de logos.
- **Assets:** - Circuitos: SVGs desde el repo de Julesr0y.
    - Logos: Utilizar URLs de media.formula1.com o CDN equivalente.
- **PWA:** Service Workers para caching de datos y funcionamiento offline básico.
- **Animaciones:** Framer Motion o transiciones de CSS puro para cambios de pestañas y entrada de cards.
## 🖼️ Image Assets Strategy
- **Circuitos (Dinámicos):** URL Base: `https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/`
  - Si theme === 'dark' -> `${base}/white-outline/${id}.svg`
  - Si theme === 'light' -> `${base}/black-outline/${id}.svg`
