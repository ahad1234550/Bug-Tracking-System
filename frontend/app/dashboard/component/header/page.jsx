"use client"
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faListCheck } from "@fortawesome/free-solid-svg-icons";
import "./page.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Header() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("projects");

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
          onClick={() => setActiveNav("projects")}
        >
          <Link href={"/dashboard/projects"}>
            <FontAwesomeIcon icon={faLayerGroup} className="plus-icon" />
            <span>Projects</span>
          </Link>
        </div>

        <div
          className={`nav-item ${activeNav === "bugs" ? "active" : ""}`}
          onClick={() => setActiveNav("bugs")}
        >
          <Link href={"/dashboard/7/bugs"}>
            <FontAwesomeIcon icon={faListCheck} className="plus-icon" />
            <span>Bugs</span>
          </Link>
        </div>
      </div>
      <div className="header-right" onClick={() => logout()}>
        {/* <Link href={"/dashboard/profile"}> */}
        <div className="profile-badge">
          <Image src="/user.png" className="user-avatar" width={40} height={40} alt="user-avatar" />
          <span className="profile-name">Dev.</span>
        </div>
        {/* </Link> */}
      </div>
    </header>
  );
}
