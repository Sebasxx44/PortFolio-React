import { useState } from "react"
import { SERVICES } from "../../utils/data"
import { ServicesCard } from "./ServicesCard/ServicesCard"
import './Services.css'


export function Services() {

    return(
        <>
            <section className="services-container fade-in">

                <h5>Services</h5>

                <div className="services-content">

                    {SERVICES.map((service) => (
                        <ServicesCard key={service.title} details={service} />
                    ))}

                </div>

            </section>
        </>
    )
}