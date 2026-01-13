import "./page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="form-section-home">
      <header className="header">
        <p>Already have an account? <Link href={"/login"}>Sign In</Link></p>
      </header>

      <div className="content">
        <h1>Join Us!</h1>
        <p className="subtitle">To begin this journey, tell us what type of account you'd be opening.</p>

        <div className="options-list">
          <Link href={"/signup/manager"}>
            <div className="option-card">
              <div className="icon"><FontAwesomeIcon icon={faUser} /></div>
              <div className="text">
                <h3>Manager</h3>
                <p>Signup as a manager to manage the tasks and bugs</p>
              </div>
              <i className="fa-solid fa-arrow-right arrow"></i>
            </div>
          </Link>

          <Link href={"/signup/developer"}>
            <div className="option-card">
              <div className="icon"><FontAwesomeIcon icon={faBriefcase} /></div>
              <div className="text">
                <h3>Developer</h3>
                <p>Signup as a Developer to design the relevant cost to QA</p>
              </div>
              <i className="fa-solid fa-arrow-right arrow"></i>
            </div>
          </Link>

          <Link href={"/signup/qa"}>
            <div className="option-card">
              <div className="icon"><FontAwesomeIcon icon={faUser} /></div>
              <div className="text">
                <h3>QA</h3>
                <p>Signup as a QA to design the bugs the relevant cost to QA</p>
              </div>
              <i className="fa-solid fa-arrow-right arrow"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>

  );
}
