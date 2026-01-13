"use client"
import { faArrowDownWideShort, faArrowUpWideShort, faBars, faBorderAll, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./bug.css";
import { useCallback, useEffect, useState } from "react";
import Grid from "./grid/page";
import List from "./list/page";
import AddBugModal from "./add_bug_modal";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Bugs() {
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bugs, setBugs] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filter, setFilter] = useState("ascending");
  const [assignedTo, setAssignedTo] = useState("");
  const [developers, setDevelopers] = useState([]);

  const { project_id, project_name } = useParams();
  const decodedProjectName = decodeURIComponent(project_name);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/${project_id}/getAllAssociatedDeveloper`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDevelopers(data.data || []);
      } catch {
        toast.error("Failed to load developers");
      }
    };
    fetchDevelopers();
  }, [project_id]);

  const getBugs = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bug/${project_id}/readBug?search=${debouncedSearch}&filter=${filter}&assignTo=${assignedTo}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message);
        setBugs([]);
        return;
      }
      const data = await res.json();
      setBugs(data.data.bugs || []);
      setRole(data.data.role);
    } catch {
      toast.error("Failed to fetch bugs");
      setBugs([]);
    }
  }, [project_id, debouncedSearch, filter, assignedTo]);

  useEffect(() => {
    getBugs();
  }, [getBugs]);

  return (
    <div className="bugs-page-container">
      <div className="sub-header">
        <div className="welcome-section">
          <p>
            <Link href={"/dashboard/projects"}>Projects</Link> &nbsp; &gt; &nbsp;{" "}
            <strong>{decodedProjectName}</strong>
          </p>
          <h2>All Bugs Listing</h2>
        </div>

        {role === "qa" && (
          <div className="add-container">
            <button className="add-bug-btn" onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faPlus} className="plus-icon" />
              Add New Bug
            </button>
          </div>
        )}
      </div>

      <div className="sub-header">
        <div className="welcome-section">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon plus-icon" />
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="action-section">
          <div>
            <select
              name="assigned"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assigned to</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>

          <div className="icons" onClick={() => setFilter(filter === "ascending" ? "descending" : "ascending")}>
            <FontAwesomeIcon
              icon={filter === "ascending" ? faArrowUpWideShort : faArrowDownWideShort}
              className="plus-icon-filter"
            />
          </div>

          <div className={`icons ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>
            <FontAwesomeIcon icon={faBorderAll} className="plus-icon-filter" />
          </div>
          <div className={`icons ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>
            <FontAwesomeIcon icon={faBars} className="plus-icon-filter" />
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <Grid bugs={bugs} onBugUpdate={getBugs} />
      ) : (
        <List bugs={bugs} onBugUpdate={getBugs} />
      )}

      <AddBugModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project_id}
        onBugAdded={getBugs}
      />
    </div>
  );
}
