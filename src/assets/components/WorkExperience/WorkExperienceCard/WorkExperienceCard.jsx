import '../WorkExperience.css'

export function WorkExperienceCard({ details }) {

    return (
        <>

        <div className="work-experience-card">

            <h6>{details.title}</h6>

            <div className="work-duration">
                {details.date}
            </div>

            <ul>
                {details.responsabilities.map((res) => (
                    <li key={res}>{res}</li>
                ))}
            </ul>

        </div>

        </>
    );
}
