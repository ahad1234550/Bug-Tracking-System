"use client"
import { faArrowUpShortWide, faBars, faBorderAll, faFilter, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./bug.css"
import { useState } from "react";
import Grid from "./grid/page";
import List from "./list/page";
import AddBugModal from "./add_bug_modal";

export default function Projects() {
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="sub-header">
        <div className="welcome-section">
          <p>Projects &nbsp; &nbsp; &gt; &nbsp; &nbsp; Bugs</p>
          <h2>All Bugs Listing</h2>
        </div>

        <div className="add-container">
          <button className="add-bug-btn" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            Add New Bug
          </button>
        </div>
      </div>

      <div className="sub-header">
        <div className="welcome-section">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon plus-icon" />
            <input
              type="text"
              placeholder="Search for Projects here"
              className="search-input"
            />
          </div>
        </div>

        <div className="action-section">
          <div>
            <select name="assigned">
              <option>Assigned to</option>
              <option>Assigned to</option>
              <option>Assigned to</option>
              <option>Assigned to</option>
            </select>
          </div>
          <div>
            <FontAwesomeIcon icon={faFilter} className="plus-icon-filter" />
          </div>
          <div>
            <FontAwesomeIcon icon={faArrowUpShortWide} className="plus-icon-filter" />
          </div>
          <div onClick={() => { setView("grid") }}>
            <FontAwesomeIcon icon={faBorderAll} className="plus-icon-filter" />
          </div>
          <div onClick={() => { setView("list") }}>
            <FontAwesomeIcon icon={faBars} className="plus-icon-filter" />
          </div>
        </div>
      </div>

      {view === "list" && <List />}
      {view === "grid" && <Grid />}

      <AddBugModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
