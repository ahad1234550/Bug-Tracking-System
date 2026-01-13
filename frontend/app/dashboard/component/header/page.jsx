"use client"
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faListCheck, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./page.css";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeNav, setActiveNav] = useState("projects");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (pathname.includes("/bugs")) {
      setActiveNav("bugs");
    } else if (pathname.includes("/projects")) {
      setActiveNav("projects");
    }
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Logout Successfully');
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Logout failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something went wrong while logging out");
    }
  }

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="logo">
          <Image src="/logo.png" alt="ManageBug Logo" width={150} height={30} />
        </div>
        <div
          className={`nav-item ${activeNav === "projects" ? "active" : ""}`}
        >
          <Link href={"/dashboard/projects"}>
            <FontAwesomeIcon icon={faLayerGroup} className="plus-icon" />
            <span>Projects</span>
          </Link>
        </div>

        <div
          className={`nav-item ${activeNav === "bugs" ? "active" : ""}`}
        >
          <a>
            <FontAwesomeIcon icon={faListCheck} className="plus-icon" />
            <span>Bugs</span>
          </a>
        </div>
      </div>
      <div className="header-right" style={{ position: 'relative' }} ref={dropdownRef}>
        <div className="profile-badge" onClick={() => setShowDropdown(!showDropdown)}>
          <Image src="/user.png" className="user-avatar" width={40} height={40} alt="user-avatar" />
          <span className="profile-name">{user ? user.name : "Dev."}</span>
        </div>

        {showDropdown && (
          <div className="user-dropdowns">
            <div className="dropdown-item" onClick={() => { setShowDropdown(false); router.push("/dashboard/profile"); }}>
              <FontAwesomeIcon icon={faUser} />
              <span>Profile Setting</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout" onClick={() => logout()}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
