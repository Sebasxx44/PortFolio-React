import { useEffect, useMemo, useState } from "react";
import { projects } from "@/components/portfolio/content";
import { useShowcaseFocus } from "@/composables/portfolio/useShowcaseFocus";
import type { Project, ProjectFilter } from "@/components/portfolio/types";
import type {
  ProjectShowcaseState,
  ShowcaseFilterOption,
  ShowcaseNavigation,
} from "@/components/portfolio/showcase/types";

const filterValues: readonly ProjectFilter[] = ["all", "web", "app"];
const visibleProjects = (
  catalog: readonly Project[],
  filter: ProjectFilter,
): readonly Project[] =>
  catalog.filter((project) => filter === "all" || project.kind === filter);

export const useProjectShowcase = (
  catalog: readonly Project[] = projects,
): ProjectShowcaseState => {
  // Collection
  const [filter, setFilterState] = useState<ProjectFilter>("all");
  const visible = useMemo(
    () => visibleProjects(catalog, filter),
    [catalog, filter],
  );
  const filters = useMemo<ShowcaseFilterOption[]>(
    () =>
      filterValues.map((value, labelIndex) => ({
        value,
        labelIndex,
        count: visibleProjects(catalog, value).length,
      })),
    [catalog],
  );

  // Selection
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? "");
  const selectedIndex = visible.findIndex(
    (project) => project.id === selectedId,
  );
  const index = visible.length === 0 ? -1 : Math.max(0, selectedIndex);
  const active = visible[index] ?? null;
  const select = (id: string) => {
    if (visible.some((project) => project.id === id)) setSelectedId(id);
  };
  const setFilter = (nextFilter: ProjectFilter) => {
    const next = visibleProjects(catalog, nextFilter);
    setFilterState(nextFilter);
    setSelectedId((current) =>
      next.some((project) => project.id === current)
        ? current
        : (next[0]?.id ?? ""),
    );
  };

  // Navigation
  const focus = useShowcaseFocus(active?.id ?? "");
  const move = (step: number) => {
    if (visible.length === 0) return;
    const nextIndex =
      (Math.max(0, index) + step + visible.length) % visible.length;
    setSelectedId(visible[nextIndex].id);
  };
  const onIndexPointerEnter: ShowcaseNavigation["onIndexPointerEnter"] = (
    event,
    id,
  ) => {
    if (event.pointerType === "mouse" && !focus.isPreviewFocused()) select(id);
  };
  const onIndexKeyDown: ShowcaseNavigation["onIndexKeyDown"] = (
    event,
    currentIndex,
  ) => {
    if (visible.length === 0) return;
    let targetIndex: number;
    switch (event.key) {
      case "ArrowDown":
        targetIndex = (currentIndex + 1) % visible.length;
        break;
      case "ArrowUp":
        targetIndex = (currentIndex - 1 + visible.length) % visible.length;
        break;
      case "Home":
        targetIndex = 0;
        break;
      case "End":
        targetIndex = visible.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const target = visible[targetIndex];
    setSelectedId(target.id);
    focus.focusIndex(target.id);
  };

  // Warm adjacent previews without downloading the entire catalog.
  useEffect(() => {
    if (visible.length < 2 || index < 0) return;
    const neighbors = new Set([
      (index + 1) % visible.length,
      (index - 1 + visible.length) % visible.length,
    ]);
    neighbors.forEach((neighbor) => {
      const preview = new Image();
      preview.decoding = "async";
      preview.src = `/images/optimized/${visible[neighbor].image}.webp`;
    });
  }, [visible, index]);

  return {
    collection: { visible, filters, filter, total: catalog.length, setFilter },
    selection: {
      active,
      index,
      position: `${String(index + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`,
      select,
    },
    navigation: {
      available: visible.length > 1,
      previous: () => move(-1),
      next: () => move(1),
      panelRef: focus.panelRef,
      selectorRef: focus.selectorRef,
      setIndexRef: focus.setIndexRef,
      onIndexPointerEnter,
      onIndexKeyDown,
    },
  };
};
