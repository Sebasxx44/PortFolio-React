import '../Services.css'

export function ServicesCard({ details }) {
  return (
    <div className="service-card">
      <i className={details.icon}></i>
      <h5>{details.title}</h5>
      <p>{details.description}</p>
    </div>
  );
}
