"use client"
import Image from "next/image";
import "./page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faMobileScreenButton, faLock, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

export default function Signup() {
    const params = useParams();
    const role = params.role;
    if(role !== "manager" && role !== "qa" && role !== "developer"){
        notFound();
    }
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <div className="container">
            <div className="image-wrapper">
                <Image
                    className="image-section"
                    src={"/signup.jpg"}
                    fill
                    priority
                    alt="home"
                />
            </div>

            <div className="form-section">
                <div className="content">
                    <h1>Sign Up</h1>
                    <p className="subtitle">Please fill your information below</p>

                    <form className="signup-form">

                        <input type="hidden" name="role" value={role} />

                        <div className="input-group">
                            <label className="floating-label">Name</label>
                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                            <input type="text" placeholder="Name" />
                        </div>

                        <div className="input-group">
                            <label className="floating-label">Mobile number</label>
                            <FontAwesomeIcon icon={faMobileScreenButton} className="input-icon" />
                            <input type="text" placeholder="Mobile number" />
                        </div>

                        <div className="input-group">
                            <label className="floating-label">E-mail</label>
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            <input type="email" placeholder="E-mail" />
                        </div>

                        <div className="input-group">
                            <label className="floating-label">Password</label>
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="floating-label">Confirm Password</label>
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                            />
                            <FontAwesomeIcon
                                icon={showConfirmPassword ? faEyeSlash : faEye}
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>

                        <button type="submit" className="signup-btn">
                            Sign Up
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>

                    </form>

                    <div className="footer-text">
                        Already have an account?
                        <Link href={"/login"}>Login to your account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
