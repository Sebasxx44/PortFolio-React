import '../Services.css'

export function ServicesCard({ details }) {
  return (
    <div className="service-card">
      <span className="service-icon" aria-hidden="true">
        <i className={details.icon}></i>
      </span>
      <h5>{details.title}</h5>
      <p>{details.description}</p>
    </div>
  );
}
