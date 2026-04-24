# Technical Specification: sectorTres

## 📂 Estructura de Directorios (Capas)
```text
src/
├── api/              # Capa de datos: fetchers y transformadores
├── assets/           # Logos locales y SVGs de circuitos
├── components/       # Componentes atómicos (Button, Badge, Card)
├── constants/        # Colores escuderías (2023-2026) y Mapeos
├── hooks/            # Lógica reutilizable (useLocalStorage, useF1Data)
├── layouts/          # Layout principal (Mobile BottomNav / Desktop Tabs)
├── pages/            # Vistas principales (Main, Championships, Favorites, Settings)
├── store/            # Estado global (si fuera necesario, sino local/context)
└── utils/            # Formateadores de fecha y hora local
