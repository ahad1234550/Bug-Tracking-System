"use client";

import "./page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";

export default function Login() {
    const router = useRouter();

    const { loading } = useAuth({ redirectToDashboardIfLoggedIn: true });

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message);
                return;
            }

            const data = await res.json();
            toast.success("Login Successfully");
            setTimeout(() => {
                router.push("/dashboard/projects");
            }, 1500);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="form-section-login">
            <div className="content">
                <h1>Login</h1>
                <p className="subtitle">Please enter your login details</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="floating-label">E-mail</label>
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="floating-label">Password</label>
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </form>

                <div className="footer-text">
                    Don't have an account? <Link href="/">Create account</Link>
                </div>
            </div>
        </div>
    );
}
