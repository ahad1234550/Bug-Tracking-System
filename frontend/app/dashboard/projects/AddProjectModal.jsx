"use client";
import React, { useRef, useState } from 'react';
import './AddProjectModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";

export default function AddProjectModal({ isOpen, onClose }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add new Project</h2>
                </div>

                <div className="modal-body">
                    <div className="form-section">
                        <div className="form-group">
                            <label>Project name</label>
                            <input type="text" placeholder="Enter project name" />
                        </div>

                        <div className="form-group">
                            <label>Short details</label>
                            <input type="text" placeholder="Enter details here" />
                        </div>

                        <div className="form-group">
                            <label>Assign to</label>
                            <select defaultValue="">
                                <option value="" disabled hidden>QA</option>
                                <option value="qa1">QA 1</option>
                                <option value="qa2">QA 2</option>
                            </select>
                        </div>
                    </div>

                    <div className="upload-section">
                        <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                            {previewUrl ? (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <img
                                        src={previewUrl}
                                        alt="Logo Preview"
                                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faImage} className="upload-icon" />
                                    <span className="upload-text">Upload logo</span>
                                </>
                            )}
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/gif"
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-add">Add</button>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
