import type { Copy, Locale, Project } from "@/components/portfolio/types";
import es from "@/assets/utils/es.json";
import en from "@/assets/utils/en.json";
import pt from "@/assets/utils/pt.json";

export const email = "sanchezz3s47@gmail.com";
export const github = "https://github.com/Sebasxx44";
export const linkedin = "https://www.linkedin.com/in/sebastian-sanchez-osorio/";
export const experience = { es: es.workExp, en: en.workExp, pt: pt.workExp };
export const cv: Record<Locale, string> = {
  es: "/cvs/CV-Sebastian-Sanchez-Espanol.pdf",
  en: "/cvs/CV-Sebastian-Sanchez-English.pdf",
  pt: "/cvs/CV-Sebastian-Sanchez-Portugues.pdf",
};

export const copy: Record<Locale, Copy> = {
  es: {
    nav: ["Proyectos", "Sobre mí", "Trayectoria"],
    contact: "Hablemos",
    availability: "Abierto a nuevas conexiones",
    discipline: "DESARROLLADOR FULL STACK",
    heroTop: "Código preciso.",
    heroBottom: "Ideas sin límites.",
    intro:
      "Soy Sebastián Sánchez. Transformo ideas complejas en experiencias digitales que se sienten simples.",
    viewWork: "Explorar proyectos",
    cv: "Descargar CV",
    explore: "DESLIZA PARA EXPLORAR",
    sculpture:
      "Retrato 3D de Sebastián con la mirada centrada y parpadeo natural.",
    pause: "Pausar movimiento",
    play: "Activar movimiento",
    chrome: "Natural",
    acid: "Arcilla",
    home: "Inicio",
    now: "ACTUALIDAD",
    workLabel: "TRABAJO SELECCIONADO",
    workTitle: "Ideas que ya\nviven en la web.",
    workIntro:
      "Productos reales, interfaces con intención y mucho código detrás.",
    filters: ["Todo", "Sitios web", "Aplicaciones"],
    live: "Visitar proyecto",
    source: "Ver código",
    aboutLabel: "DETRÁS DEL CÓDIGO",
    aboutTitle: "Curioso por naturaleza.\nDesarrollador por elección.",
    aboutText:
      "De Pereira, Colombia, a donde llegue una buena idea. Trabajo entre frontend y backend, conectando diseño, lógica y personas. Me interesa tanto lo que una interfaz hace como lo que te hace sentir.",
    aboutNote:
      "Creo en las soluciones claras, los detalles cuidados y el aprendizaje constante.",
    experienceLabel: "EL CAMINO RECORRIDO",
    experienceTitle: "Experiencia que\nse convierte en criterio.",
    stackLabel: "MI CAJA DE HERRAMIENTAS",
    stackTitle: "La tecnología cambia.\nLa curiosidad permanece.",
    stackIntro:
      "Elijo herramientas para resolver el problema. Este es el ecosistema en el que construyo.",
    stackGroups: ["Interfaces", "Sistemas & datos", "Flujo de trabajo"],
    contactLabel: "EL SIGUIENTE PROYECTO",
    contactTop: "¿Y si hacemos",
    contactBottom: "algo increíble?",
    contactText:
      "Una idea, una oportunidad o una buena conversación. Mi bandeja está abierta.",
    copyEmail: "Copiar correo",
    copied: "Correo copiado",
    copyFailed: "No se pudo copiar. Usa el enlace de correo.",
    made: "Diseñado y desarrollado por Sebaz",
    skip: "Saltar al contenido",
    menu: "Abrir navegación",
    closeMenu: "Cerrar navegación",
    language: "Idioma",
  },
  en: {
    nav: ["Work", "About", "Experience"],
    contact: "Let’s talk",
    availability: "Open to new connections",
    discipline: "FULL STACK DEVELOPER",
    heroTop: "Precise code.",
    heroBottom: "Boundless ideas.",
    intro:
      "I’m Sebastián Sánchez. I turn complex ideas into digital experiences that feel simple.",
    viewWork: "Explore my work",
    cv: "Download CV",
    explore: "SCROLL TO EXPLORE",
    sculpture:
      "3D portrait of Sebastián with a centered gaze and natural blinking.",
    pause: "Pause motion",
    play: "Enable motion",
    chrome: "Natural",
    acid: "Clay",
    home: "Home",
    now: "NOW",
    workLabel: "SELECTED WORK",
    workTitle: "Ideas out in\nthe real world.",
    workIntro:
      "Real products, intentional interfaces, and a lot of code behind the scenes.",
    filters: ["All work", "Websites", "Applications"],
    live: "Visit project",
    source: "View source",
    aboutLabel: "BEHIND THE CODE",
    aboutTitle: "Curious by nature.\nDeveloper by choice.",
    aboutText:
      "From Pereira, Colombia, to wherever a good idea takes me. I work across frontend and backend, connecting design, logic, and people. I care as much about what an interface does as how it makes you feel.",
    aboutNote:
      "I believe in clear solutions, thoughtful details, and never stopping learning.",
    experienceLabel: "THE JOURNEY SO FAR",
    experienceTitle: "Experience that\nshapes perspective.",
    stackLabel: "MY TOOLKIT",
    stackTitle: "Technology evolves.\nCuriosity stays.",
    stackIntro:
      "I choose tools to solve the problem. This is the ecosystem I build with.",
    stackGroups: ["Interfaces", "Systems & data", "Workflow"],
    contactLabel: "THE NEXT PROJECT",
    contactTop: "What if we build",
    contactBottom: "something great?",
    contactText:
      "An idea, an opportunity, or a good conversation. My inbox is open.",
    copyEmail: "Copy email",
    copied: "Email copied",
    copyFailed: "Could not copy. Use the email link.",
    made: "Designed and developed by Sebaz",
    skip: "Skip to content",
    menu: "Open navigation",
    closeMenu: "Close navigation",
    language: "Language",
  },
  pt: {
    nav: ["Projetos", "Sobre mim", "Trajetória"],
    contact: "Vamos conversar",
    availability: "Aberto a novas conexões",
    discipline: "DESENVOLVEDOR FULL STACK",
    heroTop: "Código preciso.",
    heroBottom: "Ideias sem limites.",
    intro:
      "Sou Sebastián Sánchez. Transformo ideias complexas em experiências digitais que parecem simples.",
    viewWork: "Explorar projetos",
    cv: "Baixar currículo",
    explore: "ROLE PARA EXPLORAR",
    sculpture:
      "Retrato 3D de Sebastián com olhar centralizado e piscar natural.",
    pause: "Pausar movimento",
    play: "Ativar movimento",
    chrome: "Natural",
    acid: "Argila",
    home: "Início",
    now: "ATUALMENTE",
    workLabel: "TRABALHOS SELECIONADOS",
    workTitle: "Ideias que já\nvivem na web.",
    workIntro:
      "Produtos reais, interfaces com intenção e muito código nos bastidores.",
    filters: ["Todos", "Sites", "Aplicações"],
    live: "Visitar projeto",
    source: "Ver código",
    aboutLabel: "POR TRÁS DO CÓDIGO",
    aboutTitle: "Curioso por natureza.\nDesenvolvedor por escolha.",
    aboutText:
      "De Pereira, Colômbia, para onde uma boa ideia me levar. Trabalho entre frontend e backend, conectando design, lógica e pessoas. Importa tanto o que uma interface faz quanto o que ela faz você sentir.",
    aboutNote:
      "Acredito em soluções claras, detalhes bem pensados e aprendizado constante.",
    experienceLabel: "O CAMINHO PERCORRIDO",
    experienceTitle: "Experiência que\nse torna perspectiva.",
    stackLabel: "MINHAS FERRAMENTAS",
    stackTitle: "A tecnologia muda.\nA curiosidade permanece.",
    stackIntro:
      "Escolho ferramentas para resolver o problema. Este é o ecossistema em que construo.",
    stackGroups: ["Interfaces", "Sistemas & dados", "Fluxo de trabalho"],
    contactLabel: "O PRÓXIMO PROJETO",
    contactTop: "E se criarmos",
    contactBottom: "algo incrível?",
    contactText:
      "Uma ideia, uma oportunidade ou uma boa conversa. Minha caixa de entrada está aberta.",
    copyEmail: "Copiar e-mail",
    copied: "E-mail copiado",
    copyFailed: "Não foi possível copiar. Use o link de e-mail.",
    made: "Projetado e desenvolvido por Sebaz",
    skip: "Pular para o conteúdo",
    menu: "Abrir navegação",
    closeMenu: "Fechar navegação",
    language: "Idioma",
  },
};

export const projects: Project[] = [
  {
    id: "forma",
    title: "FORMA Objects",
    kind: "app",
    description: {
      es: "Tienda conceptual con objetos 3D y carrito persistente.",
      en: "A concept store with 3D objects and a persistent cart.",
      pt: "Loja conceitual com objetos 3D e carrinho persistente.",
    },
    image: "forma-objects",
    url: "https://forma-objects-sebaz.vercel.app/",
    source: `${github}/forma-objects`,
    stack: ["React", "TypeScript", "Three.js"],
    tone: "sand",
  },
  {
    id: "orbit",
    title: "ORBIT Audio",
    kind: "web",
    description: {
      es: "Una experiencia de audio conceptual con configurador 3D.",
      en: "A concept audio experience with an interactive 3D configurator.",
      pt: "Uma experiência de áudio conceitual com configurador 3D.",
    },
    image: "orbit-audio",
    url: "https://orbit-audio-sebaz.vercel.app/",
    source: `${github}/orbit-audio`,
    stack: ["React", "TypeScript", "Three.js"],
    tone: "silver",
  },
  {
    id: "noma",
    title: "NÓMA Expeditions",
    kind: "web",
    description: {
      es: "Viajes imaginados, exploración 3D e itinerarios a medida.",
      en: "Imagined journeys, 3D exploration, and personalized itineraries.",
      pt: "Viagens imaginadas, exploração 3D e roteiros personalizados.",
    },
    image: "noma-expeditions",
    url: "https://noma-expeditions-sebaz.vercel.app/",
    source: `${github}/noma-expeditions`,
    stack: ["React", "TypeScript", "Three.js"],
    tone: "sage",
  },
  {
    id: "newlife",
    title: "New Life",
    kind: "web",
    description: {
      es: "Un espacio digital para conectar con el bienestar.",
      en: "A digital space to connect with wellbeing.",
      pt: "Um espaço digital para se conectar ao bem-estar.",
    },
    image: "consteladora",
    url: "https://newlife01.com/",
    stack: ["React", "Motion", "Cloudflare"],
    tone: "sage",
  },
  {
    id: "dashboard",
    title: "Data in motion",
    kind: "app",
    description: {
      es: "Datos complejos, una perspectiva más clara.",
      en: "Complex data. A clearer perspective.",
      pt: "Dados complexos. Uma perspectiva mais clara.",
    },
    image: "dashboard",
    url: "https://dashboard-sebaz.vercel.app/",
    source: `${github}/DashboardReact`,
    stack: ["React", "TypeScript", "Sass"],
    tone: "violet",
  },
  {
    id: "natunest",
    title: "Natunest",
    kind: "web",
    description: {
      es: "Una invitación a explorar la naturaleza de Pereira.",
      en: "An invitation to explore the nature of Pereira.",
      pt: "Um convite para explorar a natureza de Pereira.",
    },
    image: "app-travel",
    url: "https://natunest.vercel.app/",
    source: `${github}/landing_page_app_travel`,
    stack: ["Next.js", "TypeScript", "Tailwind"],
    tone: "sand",
  },
  {
    id: "gascertcol",
    title: "Gascertcol",
    kind: "web",
    description: {
      es: "Una presencia digital construida sobre la confianza.",
      en: "A digital presence built on trust.",
      pt: "Uma presença digital construída sobre a confiança.",
    },
    image: "gascertcol",
    url: "https://www.gascertcol.com/",
    stack: ["React", "JavaScript", "Tailwind"],
    tone: "orange",
  },
];

export const stackGroups = [
  ["React", "Nuxt", "Vue.js", "Next.js", "TypeScript", "Tailwind CSS"],
  ["Laravel", "Node.js", "NestJS", "PostgreSQL", "MySQL", "Firebase"],
  ["Git", "GitHub", "GitLab", "Docker", "Vite", "Figma"],
];
