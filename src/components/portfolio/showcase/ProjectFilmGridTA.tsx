import { useRef } from "react";
import { FiPlay, FiX } from "react-icons/fi";
import { projects } from "@/components/portfolio/content";
import type { PortfolioPreferences } from "@/components/portfolio/types";
import "./project-film.css";

const folder = "/images/portafolio-film";
const projectIds = [
  "salchiwarrior", "everest-cocktails", "milkshake-bogota",
  "corintios-pizza-corales", "purple-cocktail", "cholados-faber-y-paty", "lovely-moments",
];
const featured = projectIds.flatMap((id) => projects.filter((project) => project.id === id));

const labels = {
  es: { play: "Ver presentación", title: "Los siete proyectos de Sebaz", close: "Cerrar video", contact: "Hablemos de tu web", all: "Explorar todos los proyectos" },
  en: { play: "Watch the film", title: "Seven projects by Sebaz", close: "Close video", contact: "Let’s talk about your website", all: "Explore all projects" },
  pt: { play: "Assistir à apresentação", title: "Sete projetos de Sebaz", close: "Fechar vídeo", contact: "Vamos conversar sobre seu site", all: "Explorar todos os projetos" },
};

export const allProjectsLabel = (locale: PortfolioPreferences["locale"]) => labels[locale].all;

const TileImage = ({ name }: { name: string }) => (
  <img
    src={folder + "/" + name + "-640.webp"}
    srcSet={[400, 640, 960, 1280].map((w) => folder + "/" + name + "-" + w + ".webp " + w + "w").join(", ")}
    sizes="(max-width: 767px) 94vw, (min-width: 1600px) 488px, 30vw"
    width="960" height="540" loading="lazy" decoding="async" alt=""
  />
);

export const ProjectFilmGridTA = ({ preferences }: { preferences: PortfolioPreferences }) => {
  const { locale, copy } = preferences;
  const strings = labels[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const languageSuffix = locale === "es" ? "" : "-" + locale;
  const openFilm = () => {
    const player = video.current;
    if (!player || !dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    player.src = "/media/portafolio-sebaz.mp4";
    void player.play().catch(() => { /* Native controls also allow manual playback. */ });
  };
  const releaseFilm = () => {
    const player = video.current;
    if (!player) return;
    player.pause();
    player.removeAttribute("src");
    player.load();
  };

  return (
    <>
      <ul className="project-film-grid" aria-label={strings.title}>
        <li>
          <button type="button" className="film-tile" aria-label={strings.play + " · 33 s"} onClick={openFilm}>
            <TileImage name={"apertura" + languageSuffix} />
          </button>
        </li>
        {featured.map((project) => (
          <li key={project.id}>
            <a className="film-tile" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={copy.live + " · " + project.title}>
              <TileImage name={project.id} />
            </a>
          </li>
        ))}
        <li>
          <a className="film-tile" href="#contact" aria-label={strings.contact}>
            <TileImage name={"cierre" + languageSuffix} />
          </a>
        </li>
      </ul>
      <button type="button" className="film-watch" onClick={openFilm}>
        <FiPlay aria-hidden="true" />{strings.play}<span>0:33</span>
      </button>
      <dialog ref={dialog} className="project-film-dialog" aria-labelledby="film-title" onClose={releaseFilm}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="film-player">
          <header>
            <h3 id="film-title">{strings.title}</h3>
            <button type="button" aria-label={strings.close} onClick={() => dialog.current?.close()}><FiX aria-hidden="true" /></button>
          </header>
          <video ref={video} controls playsInline preload="none" aria-label={strings.title}>
            <track kind="captions" src="/media/portafolio-es.vtt" srcLang="es" label="Español" />
          </video>
        </div>
      </dialog>
    </>
  );
};
