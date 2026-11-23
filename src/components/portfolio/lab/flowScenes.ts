import { projects } from "../content";
import type { Locale } from "../types";

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
export function interval(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
}
export function smooth(value: number) {
  const t = clamp(value);
  return t * t * t * (10 + t * (-15 + 6 * t));
}
const entries = [
  ["salchiwarrior", "/images/optimized/salchiwarrior.webp", "#ff87bb"],
  ["everest-cocktails", "/images/optimized/everest-cocktails.webp", "#b89bff"],
  ["milkshake-bogota", "/images/optimized/milkshake-bogota.webp", "#ffce6a"],
] as const;
export const sites = entries.map(([id, cover, accent]) => {
  const project = projects.find((item) => item.id === id);
  if (!project) throw Error("Missing portfolio entry " + id);
  return { id, name: project.title, url: project.url, cover, accent };
});

export const sourceCode = [
  "<header>",
  "  <a>Salchiwarrior</a>",
  "  <nav>…</nav>",
  "  <button>Mi pedido</button>",
  "</header>",
].join("\n");
export const beats = [
  0, 0.098, 0.183, 0.281, 0.399, 0.568, 0.678, 0.85, 0.947,
] as const;
export const chapterSite = [0, 0, 0, 1, 1, 2, 2, -1, -1] as const;
export const reducedViews = [
  0.023, 0.164, 0.234, 0.366, 0.53, 0.626, 0.804, 0.941, 0.953,
] as const;
export function captionIndex(t: number) {
  for (let i = beats.length - 1; i > 0; i--) if (t >= beats[i]) return i;
  return 0;
}
export function galleryPosition(t: number) {
  return smooth(interval(t, 0.962, 0.972)) + smooth(interval(t, 0.982, 0.992));
}
export function visualTime(progress: number, reduced: boolean) {
  if (!reduced) return progress;
  const chapter = captionIndex(progress);
  return chapter === 8
    ? [0.954, 0.978, 1][Math.round(galleryPosition(progress))]
    : reducedViews[chapter];
}

// The exterior shot keeps its original spatial path. Each close-up reserves time for assembly.
const travelStops = [
  [0, 0],
  [0.06, 0.081],
  [0.109, 0.153],
  [0.244, 0.237],
  [0.28, 0.281],
  [0.343, 0.43],
  [0.385, 0.499],
  [0.538, 0.551],
  [0.567, 0.574],
  [0.628, 0.655],
  [0.67, 0.689],
  [0.819, 0.71],
  [0.85, 0.732],
  [0.9, 0.824],
  [0.946, 0.892],
  [1, 1],
] as const;
export function exteriorTime(t: number) {
  const i = travelStops.findIndex((p) => p[0] >= t);
  if (i <= 0) return i === 0 ? 0 : 1;
  const [a, x] = travelStops[i - 1],
    [b, y] = travelStops[i];
  const prev = travelStops[Math.max(0, i - 2)],
    next = travelStops[Math.min(travelStops.length - 1, i + 1)];
  const slope = (left: readonly number[], right: readonly number[]) =>
    (right[1] - left[1]) / (right[0] - left[0]);
  const u = interval(t, a, b),
    u2 = u * u,
    u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * x +
    (u3 - 2 * u2 + u) * (b - a) * slope(prev, travelStops[i]) +
    (-2 * u3 + 3 * u2) * y +
    (u3 - u2) * (b - a) * slope(travelStops[i - 1], next)
  );
}
const immersions = [
  { device: "laptop", start: 0.046, arrive: 0.105, leave: 0.244, end: 0.28 },
  { device: "monitor", start: 0.346, arrive: 0.396, leave: 0.538, end: 0.57 },
  { device: "menu", start: 0.622, arrive: 0.677, leave: 0.819, end: 0.852 },
] as const;
export function immersion(t: number) {
  const stop = immersions.find((s) => t > s.start && t < s.end);
  if (!stop) return null;
  return {
    device: stop.device,
    amount:
      smooth(interval(t, stop.start, stop.arrive)) *
      (1 - smooth(interval(t, stop.leave, stop.end))),
  };
}
interface Copy {
  name: string;
  play: string;
  pause: string;
  replay: string;
  back: string;
  upHint: string;
  skipShort: string;
  skip: string;
  progress: string;
  visit: string;
  open: string;
  delivery: string;
  files: string;
  build: string;
  publish: string;
  live: string;
  components: readonly [string, string, string];
  chapters: readonly [string, string][];
}
export const words: Record<Locale, Copy> = {
  es: {
    name: "Estudio de diseño web",
    play: "Reproducir",
    pause: "Pausar",
    replay: "Repetir",
    back: "Volver",
    upHint: "Sube para volver a Proyectos",
    skipShort: "Saltar",
    skip: "Saltar el recorrido",
    progress: "Progreso del recorrido",
    visit: "Visitar las webs",
    open: "Abrir",
    delivery: "Despliegue",
    files: "Archivos",
    build: "Compilando",
    publish: "Publicando",
    live: "En línea",
    components: ["Cabecera", "Carrito", "Carta"],
    chapters: [
      [
        "Entro en el boceto",
        "La cámara se acerca al portátil y atraviesa el marco de Salchiwarrior.",
      ],
      [
        "Armo la cabecera",
        "Coloco el escudo y alineo la navegación sobre el rosa de la marca.",
      ],
      [
        "Conecto el pedido",
        "La sede y el botón de pedido completan el header. Debajo se escribe su estructura HTML.",
      ],
      [
        "Abro el carrito",
        "Un pulso violeta recorre el cable hasta el carrito de Everest Cocktails.",
      ],
      [
        "Compongo el carrito",
        "Añado Frutos del Bosque. La cantidad pasa de uno a dos y el subtotal se actualiza.",
      ],
      [
        "Entro en la carta",
        "Sigo el pulso dorado del cable hasta la carta de MilkShake Bogotá.",
      ],
      [
        "Ordeno la carta",
        "Primero encajo las categorías. Después entran las fotos, los nombres y los precios de las cuatro Megas.",
      ],
      [
        "Despliego las tres webs",
        "Cada diseño pasa de la compilación a estar en línea.",
      ],
      ["Las webs en vivo", "Recorre las portadas o visita las tres webs."],
    ],
  },
  en: {
    name: "Web design studio",
    play: "Play",
    pause: "Pause",
    replay: "Replay",
    back: "Back",
    upHint: "Scroll up to return to Projects",
    skipShort: "Skip",
    skip: "Skip the journey",
    progress: "Journey progress",
    visit: "Visit the sites",
    open: "Open",
    delivery: "Deployment",
    files: "Files",
    build: "Building",
    publish: "Publishing",
    live: "Live",
    components: ["Header", "Cart", "Menu"],
    chapters: [
      [
        "Into the sketch",
        "The camera moves towards the laptop and through the frame of Salchiwarrior.",
      ],
      [
        "Building the header",
        "I place the crest and align the navigation against the brand’s signature pink.",
      ],
      [
        "Connecting the order",
        "The location and order button complete the header as its HTML is written below.",
      ],
      [
        "Opening the cart",
        "A violet pulse runs along the cable to the Everest Cocktails cart.",
      ],
      [
        "Building the cart",
        "I add Frutos del Bosque, increase the quantity to two and update the subtotal.",
      ],
      [
        "Into the menu",
        "The camera follows a golden pulse along the cable to the MilkShake Bogotá menu.",
      ],
      [
        "Laying out the menu",
        "I align the categories, then add the photos, names and prices for four Megas.",
      ],
      ["Deploying the sites", "Each design moves from build to live."],
      [
        "The live sites",
        "Explore the finished homepages or open any of the three sites.",
      ],
    ],
  },
  pt: {
    name: "Estúdio de design web",
    play: "Reproduzir",
    pause: "Pausar",
    replay: "Repetir",
    back: "Voltar",
    upHint: "Role para cima para voltar aos projetos",
    skipShort: "Pular",
    skip: "Pular o percurso",
    progress: "Progresso do percurso",
    visit: "Visitar os sites",
    open: "Abrir",
    delivery: "Implantação",
    files: "Arquivos",
    build: "Compilando",
    publish: "Publicando",
    live: "No ar",
    components: ["Cabeçalho", "Carrinho", "Cardápio"],
    chapters: [
      [
        "Entro no esboço",
        "A câmera se aproxima do notebook e atravessa a moldura do Salchiwarrior.",
      ],
      [
        "Monto o cabeçalho",
        "Posiciono o escudo e alinho a navegação sobre o rosa da marca.",
      ],
      [
        "Conecto o pedido",
        "A unidade e o botão de pedido completam o cabeçalho enquanto o HTML é escrito abaixo.",
      ],
      [
        "Abro o carrinho",
        "Um pulso violeta percorre o cabo até o carrinho do Everest Cocktails.",
      ],
      [
        "Monto o carrinho",
        "Adiciono Frutos del Bosque. A quantidade passa de um para dois e o subtotal é atualizado.",
      ],
      [
        "Entro no cardápio",
        "A câmera segue o pulso dourado do cabo até o cardápio do MilkShake Bogotá.",
      ],
      [
        "Organizo o cardápio",
        "Alinho as categorias e monto quatro Megas com fotos, nomes e preços.",
      ],
      [
        "Publico os três sites",
        "Cada design passa pela compilação até ficar no ar.",
      ],
      [
        "Os sites no ar",
        "Explore as páginas iniciais ou visite os três sites.",
      ],
    ],
  },
};
