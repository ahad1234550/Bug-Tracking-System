"use client"
import Image from "next/image";
import "./page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
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
                    <h1>Login</h1>
                    <p className="subtitle">Please enter your login details</p>

                    <form className="login-form">

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

                        <Link href={"/dashboard/projects"}  type="submit" className="login-btn">
                            Login
                            <FontAwesomeIcon icon={faChevronRight} />
                        </Link>

                    </form>

                    <div className="footer-text">
                        Don't have an account?
                        <Link href={"/"}>Create account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
