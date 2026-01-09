"use client";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./page.css"
import Image from "next/image";
import { useState } from "react";
import AddProjectModal from "./AddProjectModal";

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="sub-header">
        <div className="welcome-section">
          <h2>Visnext Software Solutions</h2>
          <p>Hi DeVisnext, welcome to ManageBug</p>
        </div>

        <div className="search-add-container">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search for Projects here"
              className="search-input"
            />
          </div>

          <div className="action-section">
            <button className="add-bug-btn" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
              Add New Project
            </button>
          </div>
        </div>
      </div>

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

      <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
