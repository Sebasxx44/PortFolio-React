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
                            "I'm a Software developer"
                        ]}
                        typeSpeed={55}
                        backSpeed={70}
                        attr="placeholder"
                        loop
                >
                <input disabled type="text" className="input-typed"/>
                    </ReactTyped>

                    <p>Junior Full Stack Developer with a talent for problem-solving and a creative mindset. Dedicated to delivering innovative web solutions.</p>

                    <div className="content-buttons">
                        <button onClick={downloadCv} className="button-download-cv"><i className="fa-regular fa-file"></i> Download CV</button>
                        <button className="button-github" onClick={() => window.open("https://github.com/Sebasxx44")}><i className="fa-brands fa-github"></i> Github</button>
                    </div>

                </div>

                <div className="about-picture">
                    <img src={photo} alt="photo" />
                </div>

                

            </div>
        </section>

        
        </>
    )
}