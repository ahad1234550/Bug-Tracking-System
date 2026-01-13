"use client"
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./page.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/me`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
          setNumber(data.data.number || "");
        } else {
          toast.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/updateprofile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ number }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setUser(prev => ({ ...prev, number }));
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Something went wrong during update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!user) return <div className="error-container">User not found</div>;

  return (
    <>
      <div className="profile-header">
        <h2>Profile Setting</h2>
      </div>
    <div className="profile-container">

      <div className="profile-content">
        <div className="display-box">
          <FontAwesomeIcon icon={faUser} className="field-icon" />
          <span className="field-text">{user.name}</span>
        </div>

        <div className="editable-field">
          <label className="field-label">Mobile number</label>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faMobileAlt} className="field-icon-dark" />
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="number-input"
            />
          </div>
        </div>

        <div className="display-box">
          <FontAwesomeIcon icon={faEnvelope} className="field-icon" />
          <span className="field-text">{user.email}</span>
        </div>

        <div className="action-area">
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="update-btn"
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
