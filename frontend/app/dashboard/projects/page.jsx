"use client";

import { faPlus, faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./project.css";
import { useEffect, useState, useCallback } from "react";
import AddProjectModal from "./add_project_modal";
import EditProjectModal from "./edit_project_modal";
import { toast } from "react-toastify";
import ProjectsGrid from "./project_grid";

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const getProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/readProject?search=${search}`,
        { method: "GET", credentials: "include" }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message);
        setProjects([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProjects(data.data?.projects || []);
      setRole(data.data.role);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    getProjects();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedProject(null);
    getProjects();
  };

  return (
    <div className="projects-page-container">
      <div className="sub-header">
        <div className="welcome-section">
          <h2>Visnext Software Solutions</h2>
          <p>Hi DeVisnext, welcome to ManageBug</p>
        </div>

        <div className="search-add-container">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text" name="search"
              placeholder="Search for Projects here"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {role === "manager" && (<div className="action-section">
            <button
              className="add-bug-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
              Add New Project
            </button>
          </div>)}
        </div>
      </div>

      <ProjectsGrid
        projects={projects}
        loading={loading}
        role={role}
        onEdit={handleEditClick}
      />


      <AddProjectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        project={selectedProject}
      />
    </div>
  );
}
