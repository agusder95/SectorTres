# Project Rules: sectorTres

## 🛠 Coding Standards
- **Framework:** React 18+ con Vite.
- **Styling:** Tailwind CSS únicamente. Prohibido usar CSS modules o Inline styles (a menos que sea dinámico por JS).
- **Mobile-First:** El diseño base es para mobile. Los prefijos `sm:`, `md:`, `lg:` se usan solo para adaptar a pantallas grandes.
- **Componentes:** Funcionales con Hooks. Preferir `lucide-react` para iconos.
- **Endpoints:** Usar la estructura de Jolpi API provista en la Tech Spec.

## 🎨 Design Rules
- **Temas:** - Light: Circuitos `/black-outline/`.
    - Dark: Circuitos `/white-outline/`.
- **Colores:** Usar las constantes de `TEAM_COLORS` para bordes, sombras sutiles o acentos de tarjetas.
- **Interacciones:** Todas las transiciones de pestañas y carga de cards deben usar `framer-motion` o transiciones de CSS suaves (0.3s ease).

## 📂 Data Management
- **Persistence:** Solo `localStorage`.
- **States:** Manejar estados de `loading` (Skeleton screens) y `error` (mensaje amigable + reintento).
- **Formatos:** - Horas: Siempre transformar UTC a Local. 
    - Fechas: `dd/MM/AA`.
