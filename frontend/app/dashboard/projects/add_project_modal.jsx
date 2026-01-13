"use client";
import React, { useEffect, useRef, useState } from 'react';
import './add_project_modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { toast } from 'react-toastify';
import useProject from './use_project';

export default function AddProjectModal({ isOpen, onClose }) {

    const { qa, developer, loadUsers } = useProject();

    useEffect(() => {
        if (isOpen) loadUsers();
    }, [isOpen, loadUsers]);

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [shortDetails, setShortDetails] = useState("");

    const [selectedQAs, setSelectedQAs] = useState([]);
    const [selectedDevs, setSelectedDevs] = useState([]);
    const [isQAOpen, setIsQAOpen] = useState(false);
    const [isDevOpen, setIsDevOpen] = useState(false);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const toggleSelection = (id, currentList, setList) => {
        if (currentList.includes(id)) {
            setList(currentList.filter(item => item !== id));
        } else {
            setList([...currentList, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", projectName);
        formData.append("description", shortDetails);

        if (selectedFile) formData.append("logo", selectedFile);

        selectedQAs.forEach(q => formData.append("QA[]", q));
        selectedDevs.forEach(d => formData.append("developer[]", d));


        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/addProject`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message);
                return;
            }

            const data = await res.json();
            toast.success("Project added successfully!");
            onClose();
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Image not uploaded || Invalid Extension(Valid: png/gif)");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="modal-overlay-add-project" onClick={onClose}>
            <div className="modal-content" onClick={(e) => {
                e.stopPropagation();
                if (isQAOpen) setIsQAOpen(false);
                if (isDevOpen) setIsDevOpen(false);
            }}>
                <div className="modal-header">
                    <h2>Add new Project</h2>
                </div>

                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="modal-body">
                        <div className="form-section">
                            <div className="form-group">
                                <label>Project name</label>
                                <input
                                    type="text"
                                    placeholder="Enter project name"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Short details</label>
                                <input
                                    type="text"
                                    placeholder="Enter details here"
                                    value={shortDetails}
                                    onChange={(e) => setShortDetails(e.target.value)}
                                />
                            </div>

                            <div className="form-group" onClick={(e) => e.stopPropagation()}>
                                <label>Assign to QA</label>
                                <div className="custom-select" onClick={() => setIsQAOpen(!isQAOpen)}>
                                    {selectedQAs.length > 0
                                        ? <span>{selectedQAs.map(id => qa.find(q => q.id === id)?.name).join(", ")}</span>
                                        : <span className="placeholder-text">Select QAs</span>
                                    }
                                </div>
                                {isQAOpen && (
                                    <div className="dropdown-menu">
                                        {qa.map(qa => (
                                            <div key={qa.id} className="dropdown-item" onClick={() => toggleSelection(qa.id, selectedQAs, setSelectedQAs)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedQAs.includes(qa.id)}
                                                    readOnly
                                                />
                                                {qa.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group" onClick={(e) => e.stopPropagation()}>
                                <label>Assign to Developers</label>
                                <div className="custom-select" onClick={() => setIsDevOpen(!isDevOpen)}>
                                    {selectedDevs.length > 0
                                        ? <span>{selectedDevs.map(id => developer.find(d => d.id === id)?.name).join(", ")}</span>
                                        : <span className="placeholder-text">Select Developers</span>
                                    }
                                </div>
                                {isDevOpen && (
                                    <div className="dropdown-menu">
                                        {developer.map(dev => (
                                            <div key={dev.id} className="dropdown-item" onClick={() => toggleSelection(dev.id, selectedDevs, setSelectedDevs)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDevs.includes(dev.id)}
                                                    readOnly
                                                />
                                                {dev.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                        <div className='btn'>
                            <button className="btn-add" type="submit">Add</button>
                            <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
                        </div>
                        <div className='non-btn'></div>
                    </div>
                </form>
            </div>
        </div>
    );
}
