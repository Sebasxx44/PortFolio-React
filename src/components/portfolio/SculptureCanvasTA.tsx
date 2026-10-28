import { useSculpture } from "@/composables/portfolio/useSculpture";
import type { SculptureControls } from "@/components/portfolio/types";

const SculptureCanvasTA = (props: SculptureControls) => {
  const { rendering } = useSculpture(props);
  return (
    <canvas
      ref={rendering.canvasRef}
      className={`sculpture-canvas ${rendering.available ? "is-ready" : ""}`}
      aria-hidden="true"
    />
  );
};

export default SculptureCanvasTA;
