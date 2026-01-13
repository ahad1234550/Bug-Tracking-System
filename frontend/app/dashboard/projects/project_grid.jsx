import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./project.css"
import Link from "next/link";

export default function ProjectsGrid({
  projects,
  loading,
  role,
  onEdit,
}) {
  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (!projects || projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div className="projects-list">
      {projects.map((project) => (
        <div key={project.id} className="project">
          <div
            className="project-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <img
              className="project-image"
              src={
                project.logo
                  ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${project.logo}`
                  : "/project.png"
              }
              width={57}
              height={58}
              alt="project-image"
            />

            {role === "manager" && (
              <button
                className="edit-btn"
                onClick={() => onEdit(project)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
          </div>

          <Link href={`/dashboard/${project.id}/${project.name}/bugs`}><h3>{project.name}</h3></Link>
          <p>{project.description || "No description"}</p>

          <p>
            Task Done:{" "}
            <span>
              {project.completedBugs}/{project.totalBugs}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
