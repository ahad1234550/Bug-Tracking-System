"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faEye, faEyeSlash, faLock, faChevronRight, faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";
import "./page.css"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SignupForm({ role }) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: role,
        number: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error:", errorData);
                toast.error(errorData.message);
                return;
            }

            const data = await res.json();
            toast.success("Signup Successfully");
            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div className="form-section-signup">
            <div className="content">
                <h1>Sign Up</h1>
                <p className="subtitle">Please fill your information below</p>

                <form className="signup-form" onSubmit={handleSubmit}>


                    <div className="input-group">
                        <label className="floating-label">Name</label>
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="floating-label">Mobile number</label>
                        <FontAwesomeIcon icon={faMobileScreenButton} className="input-icon" />
                        <input
                            type="text"
                            name="number"
                            placeholder="Mobile number"
                            value={formData.number}
                            onChange={handleChange}
                        />
                    </div>

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

                    <div className="input-group">
                        <label className="floating-label">Confirm Password</label>
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            placeholder="Confirm Password"
                            value={formData.confirm_password}
                            onChange={handleChange}
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
                    Already have an account?{" "}
                    <Link href={"/login"}>Login to your account</Link>
                </div>
            </div>
        </div>
    );
}
