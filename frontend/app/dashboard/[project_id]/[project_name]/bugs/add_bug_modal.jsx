"use client";
import React, { useRef, useState, useEffect } from 'react';
import './add_bug_modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCalendar, faCloudUploadAlt, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

const MOCK_USERS = [
  { id: 1, name: "John Michael" },
  { id: 2, name: "Harry Johnson" },
  { id: 3, name: "Lana Sapphire" },
  { id: 4, name: "Joerg Peterson" },
];

export default function AddBugModal({ isOpen, onClose, projectId, onBugAdded }) {
  const fileInputRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [developer, setDeveloper] = useState([]);
  useEffect(() => {
    if (!isOpen) return;

    const getDeveloper = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/${projectId}/getAllAssociatedDeveloper`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();
        const data = await res.json();
        setDeveloper(data.data || []);
      } catch {
        toast.error("Failed to load developers");
      }
    };

    getDeveloper();
  }, [isOpen, projectId]);


  const toggleUser = (userId) => {
    setSelectedUser(prev => prev === userId ? null : userId);
    setIsDropdownOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", details);
    formData.append("developer_id", selectedUser);
    formData.append("deadline", selectedDate);
    formData.append("type", type);
    formData.append("project_id", projectId);
    formData.append("status", "new");
    if (selectedFile) {
      formData.append("screenshot", selectedFile);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bug/addBug`, {
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
      toast.success("Bug added successfully!");
      if (onBugAdded) onBugAdded();
      onClose();
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Image Not Valid or empty");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bug-modal-overlay" onClick={onClose}>
      <div className="bug-modal-content" onClick={(e) => {
        e.stopPropagation();
        if (isDropdownOpen && !e.target.closest('.user-dropdown-container')) {
          setIsDropdownOpen(false);
        }
      }}>
        <button className="close-btn" onClick={onClose} type="button">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="bug-modal-header">
          <h2>Add new bug</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="controls-row">
            <div className="control-group user-dropdown-container" style={{ position: 'relative' }}>
              <span className="control-label">Assign to</span>
              <div className="avatar-group">
                {selectedUser ? (() => {
                  const user = developer.find(u => u.id === selectedUser);
                  return user ? (
                    <div className="avatar" style={{ backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>
                      {user.name.charAt(0)}
                    </div>
                  ) : null;
                })() : null}

                <button type="button" className="add-avatar-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px' }} />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">Assign to</div>
                  <ul className="user-list">
                    {developer.map(user => (
                      <li key={user.id} className="user-item" onClick={() => toggleUser(user.id)}>
                        <div className="user-avatar" style={{ backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
                          {user.name.charAt(0)}
                        </div>
                        <span className="user-name">{user.name}</span>
                        <input
                          type="checkbox"
                          className="user-checkbox"
                          checked={selectedUser === user.id}
                          readOnly
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="control-group">
              <span className="control-label">Add due date</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button type="button" className="date-btn" onClick={() => document.getElementById('date-picker').showPicker()}>
                  <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '14px' }} />
                </button>
                {selectedDate && <span style={{ fontSize: '14px', color: '#333' }}>{selectedDate}</span>}
                <input
                  id="date-picker"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "32px",
                    height: "32px",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                />

              </div>
            </div>
          </div>

          <input
            type="text"
            className="title-input"
            placeholder="Add title here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            type="text"
            className="detail-input"
            placeholder="Select Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option>Select Type</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
          </select>

          <label className="detail-label">Bug details</label>
          <input
            type="text"
            className="detail-input"
            placeholder="Add here"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <div className="upload-area" onClick={() => fileInputRef.current.click()}>
            <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
            <p className="upload-text">
              {selectedFile ? selectedFile.name : (
                <>Drop any file here or <span className="upload-link">browse</span></>
              )}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/png, image/gif"
            />
          </div>

          <div className="bug-modal-footer">
            <button className="add-btn" type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
