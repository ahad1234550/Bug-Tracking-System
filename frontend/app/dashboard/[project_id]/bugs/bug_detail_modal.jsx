"use client";
import React from 'react';
import './bug_detail_modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

export default function BugDetailModal({ isOpen, bug, onClose }) {
    if (!isOpen || !bug) return null;

    return (
        <div className="bug-modal-overlay" onClick={onClose}>
            <div className="bug-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} type="button">
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="bug-modal-header">
                    <h5>Bug Details</h5>
                </div>

                <div className="controls-row">
                    <div className="control-group">
                        <span className="control-label">Assigned to</span>
                        <div className="avatar-group">
                            {bug.developer_name && (
                                <div
                                    className="avatar"
                                    style={{
                                        backgroundColor: 'black',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '10px'
                                    }}
                                >
                                    {bug.developer_name.charAt(0)}
                                </div>
                            )}
                            <span style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>
                                {bug.developer_name || 'Unassigned'}
                            </span>
                        </div>
                    </div>

                    <div className="control-group">
                        <span className="control-label">Due date</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button type="button" className="date-btn" style={{ cursor: 'default' }}>
                                <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '14px' }} />
                            </button>
                            <span style={{ fontSize: '14px', color: '#333' }}>
                                {bug.deadline ? format(new Date(bug.deadline), "dd-MM-yyyy") : 'No deadline'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-display-section">
                    <h3 className="detail-display-title">{bug.title || 'No title'}</h3>
                </div>

                <div className="detail-display-section">
                    <label className="detail-label">Type</label>
                        <span className={`status ${bug.type}`} style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            textTransform: 'capitalize'
                        }}>
                            {bug.type || 'N/A'}
                        </span>
                </div>

                <div className="detail-display-section">
                    <label className="detail-label">Status</label>
                    <span className={`status ${bug.status}`} style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        display: 'inline-block',
                        textTransform: 'capitalize'
                    }}>
                        {bug.status || 'N/A'}
                    </span>
                </div>

                <div className="detail-display-section">
                    <label className="detail-label">Bug details</label>
                    <div className="detail-display-text">
                        {bug.description || 'No description provided'}
                    </div>
                </div>

                {bug.screenshot && (
                    <div className="detail-display-section">
                        <label className="detail-label">Screenshot</label>
                        <div className="screenshot-container">
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${bug.screenshot}`}
                                alt="Bug screenshot"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '150px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0'
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="bug-modal-footer">
                    <button className="add-btn" onClick={onClose} type="button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
