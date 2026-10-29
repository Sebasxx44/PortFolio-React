// IMPORTS
import type { Locale } from "@/components/portfolio/types";
import type { ProjectPickerLabels } from "@/components/portfolio/showcase/picker/types";

// CONSTANTS
export const projectPickerLabels: Record<Locale, ProjectPickerLabels> = {
  es: {
    title: "Explora mis proyectos.",
    subtitle: "PROYECTOS SELECCIONADOS",
    search: "Buscar proyecto o tecnología",
    close: "Cerrar proyectos",
    clear: "Limpiar búsqueda",
    empty: "No hay proyectos con esa búsqueda.",
    current: "Seleccionado",
  },
  en: {
    title: "Explore my projects.",
    subtitle: "SELECTED PROJECTS",
    search: "Search projects or technologies",
    close: "Close projects",
    clear: "Clear search",
    empty: "No projects match your search.",
    current: "Selected",
  },
  pt: {
    title: "Explore meus projetos.",
    subtitle: "PROJETOS SELECIONADOS",
    search: "Buscar projeto ou tecnologia",
    close: "Fechar projetos",
    clear: "Limpar busca",
    empty: "Nenhum projeto corresponde à busca.",
    current: "Selecionado",
  },
};
