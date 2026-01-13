"use client"
import { faArrowUpShortWide, faBars, faBorderAll, faFilter, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./bug.css"
import { useCallback, useEffect, useState } from "react";
import Grid from "./grid/page";
import List from "./list/page";
import AddBugModal from "./add_bug_modal";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function Bugs() {
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { project_id } = useParams();
  const [bugs, setBugs] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const getBugs = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bug/${project_id}/readBug?search=${search}`,
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
  }, [project_id, search]);

  const handleBugAdded = useCallback(() => {
    getBugs();
  }, [getBugs]);


  useEffect(() => {
    const id = setTimeout(() => getBugs(), 400);
    return () => clearTimeout(id);
  }, [getBugs]);

  const handleBugUpdate = useCallback(() => {
    getBugs();
  }, [getBugs]);

  return (
    <div className="bugs-page-container">
      <div className="sub-header">
        <div className="welcome-section">
          <p>Projects &nbsp; &nbsp; &gt; &nbsp; &nbsp; Bugs</p>
          <h2>All Bugs Listing</h2>
        </div>

        {role === "qa" && (<div className="add-container">
          <button className="add-bug-btn" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            Add New Bug
          </button>
        </div>)}
      </div>

      <div className="sub-header">
        <div className="welcome-section">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon plus-icon" />
            <input
              type="text"
              placeholder="Search for Projects here"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="action-section">
          <div onClick={() => { setView("grid") }}>
            <FontAwesomeIcon icon={faBorderAll} className="plus-icon-filter" />
          </div>
          <div onClick={() => { setView("list") }}>
            <FontAwesomeIcon icon={faBars} className="plus-icon-filter" />
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <Grid bugs={bugs} onBugUpdate={handleBugUpdate} />
      ) : (
        <List bugs={bugs} onBugUpdate={handleBugUpdate} />
      )}

      <AddBugModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectId={project_id} onBugAdded={handleBugAdded} />
    </div>
  )
}
