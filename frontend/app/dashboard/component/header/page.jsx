"use client"
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faListCheck } from "@fortawesome/free-solid-svg-icons";
import "./page.css";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [activeNav, setActiveNav] = useState("bugs");

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="logo">
          <Image src="/logo.png" alt="ManageBug Logo" width={150} height={30} />
        </div>
        <div
          className={`nav-item ${activeNav === "projects" ? "active" : ""}`}
          onClick={() => setActiveNav("projects")}
        >
          <Link href={"/dashboard/projects"}>
            <FontAwesomeIcon icon={faLayerGroup} />
            <span>Projects</span>
          </Link>
        </div>

        <div
          className={`nav-item ${activeNav === "bugs" ? "active" : ""}`}
          onClick={() => setActiveNav("bugs")}
        >
          <Link href={"/dashboard/7/bugs"}>
            <FontAwesomeIcon icon={faListCheck} />
            <span>Bugs</span>
          </Link>
        </div>
      </div>
      <div className="header-right" onClick={() => setActiveNav("profile")}>
        <Link href={"/dashboard/profile"}>
          <div className="profile-badge">
            <Image src="/user.png" className="user-avatar" width={40} height={40} alt="user-avatar" />
            <span className="profile-name">Dev.</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
