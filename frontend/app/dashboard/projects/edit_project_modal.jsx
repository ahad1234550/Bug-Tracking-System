"use client";
import React, { useEffect, useRef, useState } from 'react';
import './add_project_modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { toast } from 'react-toastify';

export default function EditProjectModal({ isOpen, onClose, project }) {

    const [qa, setQA] = useState([]);
    const [developer, setDeveloper] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [shortDetails, setShortDetails] = useState("");
    const [selectedQAs, setSelectedQAs] = useState([]);
    const [selectedDevs, setSelectedDevs] = useState([]);
    const [isQAOpen, setIsQAOpen] = useState(false);
    const [isDevOpen, setIsDevOpen] = useState(false);

    useEffect(() => {
        const getQA = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/getAllQA`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch QAs");
                const data = await res.json();
                setQA(data.data);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        const getDeveloper = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/getAllDeveloper`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch Developers");
                const data = await res.json();
                setDeveloper(data.data);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (isOpen) {
            getQA();
            getDeveloper();
        }
    }, [isOpen]);

    useEffect(() => {
        if (project && isOpen) {
            setProjectName(project.name || "");
            setShortDetails(project.description || "");
            if (project.logo) {
                setPreviewUrl(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${project.logo}`);
            } else {
                setPreviewUrl(null);
            }
            setSelectedFile(null);

            const getAssociatedQA = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/${project.id}/getAllAssociatedQA`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const ids = data.data?.map(u => u.id) || [];
                        setSelectedQAs(ids);
                    }
                } catch (error) {
                    console.error("Fetch associated QA error:", error);
                }
            };

            const getAssociatedDev = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/${project.id}/getAllAssociatedDeveloper`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const ids = data.data?.map(u => u.id) || [];
                        setSelectedDevs(ids);
                    }
                } catch (error) {
                    console.error("Fetch associated Dev error:", error);
                }
            };

            getAssociatedQA();
            getAssociatedDev();
        }
    }, [project, isOpen]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!project) return;

        const formData = new FormData();
        formData.append("name", projectName);
        formData.append("description", shortDetails);

        if (selectedFile) formData.append("logo", selectedFile);

        selectedQAs.forEach(q => formData.append("QA[]", q));
        selectedDevs.forEach(d => formData.append("developer[]", d));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/${project.id}/editProject`, {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message);
                return;
            }

            const data = await res.json();
            toast.success("Project updated successfully!");
            onClose();
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to update project");
        }
    };

    const handleDelete = async () => {
        if (!project || !confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/${project.id}/delete`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message);
                return;
            }

            toast.success("Project deleted successfully!");
            onClose();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete project");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => {
                e.stopPropagation();
                if (isQAOpen) setIsQAOpen(false);
                if (isDevOpen) setIsDevOpen(false);
            }}>
                <div className="modal-header">
                    <h2>Edit Project</h2>
                </div>

                <form onSubmit={handleUpdate} encType='multipart/form-data'>
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

                    <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button className="btn-add" type="submit">Update</button>
                            <button className="btn-cancel" type="button" onClick={onClose}>Cancel</button>
                        </div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px 40px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
