import { format } from "date-fns";
import "./page.css";
import BugActionModal from "../bug_action_modal";
import BugDetailModal from "../bug_detail_modal";
import { memo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

function Grid({ bugs, onBugUpdate }) {

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

    const handleViewDetail = (bug) => {
        setDetailBug(bug);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setDetailBug(null);
    };
    return (
        <>
            <div className="projects-list">
                {bugs && bugs.length > 0 ? (
                    bugs.map((bug) => (
                        <div key={bug.id} className="project">
                            <div className="project-detail">
                                <div className="title-action">
                                    <h3>{bug.title}</h3>
                                    <div>
                                        <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                            className="fa-icon"
                                            onClick={(e) => handleActionClick(bug, e)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                </div>

                                <p>
                                    <span className={`status ${bug.status}`}>
                                        {bug.status}
                                    </span>
                                </p>
                            </div>
                            <div className="divider"></div>
                            <div className="project-detail">
                                <div className="due-date">
                                    <p className="heading-short">Due Date</p>
                                    <p><FontAwesomeIcon icon={faCalendar} style={{ fontSize: '14px' }} />{format(new Date(bug.deadline), "dd-MM-yyyy")}</p>
                                </div>
                                <div className="assign-to">
                                    <p className="heading-short">Assign to</p>
                                    <p>{bug.developer_name}</p>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="btn-detail">
                                <button onClick={() => handleViewDetail(bug)}>View Detail</button>
                            </div>

                        </div>
                    ))
                ) : (
                    <p>No bugs found.</p>
                )}
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

export default memo(Grid);