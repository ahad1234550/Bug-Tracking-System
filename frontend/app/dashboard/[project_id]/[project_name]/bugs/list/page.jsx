"use client";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useState } from "react";
import BugActionModal from "../bug_action_modal";
import BugDetailModal from "../bug_detail_modal";
import "./page.css";
import { format } from "date-fns";

function List({ bugs, onBugUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailBug, setDetailBug] = useState(null);

  const handleActionClick = (bug, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 5,
      left: rect.left - 200,
    });
    setSelectedBug(bug);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBug(null);
  };

  const handleBugUpdate = () => {
    if (onBugUpdate) {
      onBugUpdate();
    }
  };

  const handleDescriptionClick = (bug) => {
    setDetailBug(bug);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailBug(null);
  };

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>BUG DETAILS</th>
              <th>STATUS</th>
              <th>DUE DATE</th>
              <th>Assign to</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {bugs && bugs.length > 0 ? (
              bugs.map((bug) => (
                <tr key={bug.id}>
                  <td onClick={() => handleDescriptionClick(bug)} style={{ cursor: "pointer" }}>{bug.description}</td>

                  <td>
                    <span className={`status ${bug.status}`}>
                      {bug.status}
                    </span>
                  </td>

                  <td>
                    {format(new Date(bug.deadline), "dd-MM-yyyy")}
                  </td>

                  <td>
                    {bug.developer_name}
                  </td>

                  <td>
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      className="fa-icon"
                      onClick={(e) => handleActionClick(bug, e)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No bugs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BugActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bug={selectedBug}
        onUpdate={handleBugUpdate}
        position={dropdownPosition}
      />

      <BugDetailModal
        isOpen={isDetailModalOpen}
        bug={detailBug}
        onClose={handleCloseDetailModal}
      />
    </>
  );
}

export default memo(List);