"use client";
import React, { useState, useEffect, useRef } from 'react';
import './bug_action_modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

export default function BugActionModal({ isOpen, onClose, bug, onUpdate, position }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !bug) return null;

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bug/${bug.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to update status");
                return;
            }

            const data = await res.json();
            toast.success("Bug status updated successfully!");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update bug status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this bug?")) return;

        setIsUpdating(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bug/${bug.id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to delete bug");
                return;
            }

            toast.success("Bug deleted successfully!");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete bug");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusOptions = () => {
        if (bug.type === 'feature') {
            return ['new', 'started', 'completed'];
        } else {
            return ['new', 'started', 'resolved'];
        }
    };

    const statusOptions = getStatusOptions();
    const finalStatus = bug.type === 'feature' ? 'completed' : 'resolved';

    return (
        <div
            ref={dropdownRef}
            className="bug-dropdown-content"
            style={{
                top: position?.top || 0,
                left: position?.left || 0,
            }}
        >
            <div className="bug-dropdown-header">
                <h3>Change Status</h3>
            </div>

            <div className="bug-dropdown-body">
                <button
                    className={`status-btn status-new ${bug.status === 'new' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('new')}
                    disabled={isUpdating || bug.status === 'new'}
                >
                    New
                </button>

                <button
                    className={`status-btn status-started ${bug.status === 'started' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('started')}
                    disabled={isUpdating || bug.status === 'started'}
                >
                    Started
                </button>

                <button
                    className={`status-btn status-final ${bug.status === finalStatus ? 'active' : ''}`}
                    onClick={() => handleStatusChange(finalStatus)}
                    disabled={isUpdating || bug.status === finalStatus}
                >
                    {bug.type === 'feature' ? 'Completed' : 'Resolved'}
                </button>
            </div>

            <div className="bug-dropdown-divider"></div>

            <div className="bug-dropdown-footer">
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={isUpdating}
                >
                    <div className="delete-place">
                        <p>Delete</p>
                        <div>
                            <FontAwesomeIcon icon={faTrash} className="delete-icon" />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
