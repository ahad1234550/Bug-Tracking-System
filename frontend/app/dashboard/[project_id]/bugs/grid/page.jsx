import Image from 'next/image'
import React from 'react'
import "./page.css"
export default function Grid() {
    return (
        <div className="projects-list">
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
            <div className="project">
                <Image className="project-image" src={"/project.png"} width={57} height={58} alt="project-image" />
                <h3>Project title</h3>
                <p>This is a project description coming from the backend using the api.</p>
                <p>Task Done: <span>05/10</span></p>
            </div>
        </div>
    )
}
