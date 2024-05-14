import '../Technologies.css'

export function TechnologiesCard({details}){

    const boxShadowStyle = {
        boxShadow: `0 0px 0px 0 ${details.color}, 2px 1px 5px 0 ${details.color}`
    };

    return(

        <>

            <div className='technologie-card' style={boxShadowStyle}>

                <img src={details.icon} alt="icon" />

                <div className='technologie-info'>
                    <h1>{details.name}</h1>
                    <p>{details.experience}</p>
                </div>

            </div>
        
        </>
    )
}