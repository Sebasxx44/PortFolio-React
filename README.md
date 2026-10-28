# Sebaz · Portafolio

Portafolio personal de Sebastián Sánchez. React 19, TypeScript, Vite 8, Three.js y Motion.

## Desarrollo

Requiere Node.js 22.12 o superior (recomendado: 24 LTS).

```sh
npm install
npm run dev
```

```sh
npm run test
npm run typecheck
npm run lint
npm run build
```

El contenido y los enlaces están en `src/components/portfolio/content.ts`. Los componentes nuevos usan el sufijo TA y los alias `@/`. La lógica de preferencias, navegación y renderizado vive en `src/composables/portfolio`.

La escena 3D se carga por separado, admite ratón, gestos horizontales y botones accesibles. Detiene la animación fuera de pantalla y respeta movimiento reducido. Mantiene una composición CSS si WebGL no está disponible. Los idiomas ES, EN y PT conservan sus CV originales.

Dirección visual inspirada en [MotionSites](https://motionsites.ai/), con composición y escena 3D propias. La publicación corresponde al proyecto existente de Vercel; no se modifica desde los comandos de desarrollo.
