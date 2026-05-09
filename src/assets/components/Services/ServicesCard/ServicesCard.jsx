import '../Services.css'
import { HiOutlineCodeBracket, HiOutlinePaintBrush, HiOutlineCpuChip } from "react-icons/hi2";

const SERVICE_ICONS = {
  code: HiOutlineCodeBracket,
  design: HiOutlinePaintBrush,
  software: HiOutlineCpuChip,
};

export function ServicesCard({ details }) {
  const Icon = SERVICE_ICONS[details.icon] ?? HiOutlineCodeBracket;

  return (
    <div className="service-card">
      <span className="service-icon" aria-hidden="true">
        <Icon />
      </span>
      <h5>{details.title}</h5>
      <p>{details.description}</p>
    </div>
  );
}
