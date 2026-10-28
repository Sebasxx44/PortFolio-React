import { useSpaceBackdrop } from "@/composables/portfolio/useSpaceBackdrop";
import "@/components/portfolio/space-backdrop.css";

export const SpaceBackdropTA = () => {
  // Composables
  const { rendering } = useSpaceBackdrop();

  // Render
  return (
    <div className="space-backdrop" aria-hidden="true">
      <canvas ref={rendering.canvasRef} className="space-backdrop-canvas" />
    </div>
  );
};
