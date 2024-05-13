import { useState } from "react"
import { ReactTyped } from "react-typed";
import './AboutMe.css'
import photo from '/images/PrincipalImagePhoto.jpeg'
import cv from '/cvs/HV.pdf'

export function AboutMe() {

    const downloadCv = () => {
        const urlPDF = cv;
        const link = document.createElement('a');
        link.href = urlPDF;
        link.download = 'CV-Sebastian-Sanchez.pdf'; 
        link.click();
    };

    return(
        <>

        <section className="about-container">
            <div className="about-content">

                <div className="about-info">

                    <h5>
                        Hi, Everyone
                    </h5>

                    <h2>
                        Sebaz Sanchez
                    </h2>

                    <ReactTyped
                    className="input-typed"
                        strings={[
                            "I'm a Web developer",
                            "I'm a Web designer",
                        ]}
                        typeSpeed={80}
                        backSpeed={70}
                        attr="placeholder"
                        loop
                >
                <input disabled type="text" className="input-typed"/>
                    </ReactTyped>

                    <p>nsectetur exercitationem veritati necessitatibus itaque quaerat, quos perspiciatis porro rem adipisci veritatis ullam voluptas veniam sed ipsam voluptatibus alias a!</p>
                    <button onClick={downloadCv} className="button-download-cv">Download CV</button>

                </div>

                <div className="about-picture">
                    <img src={photo} alt="photo" />
                </div>

                

            </div>
        </section>

        
        </>
    )
}