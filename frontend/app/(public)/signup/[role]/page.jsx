import "./page.css";
import { notFound } from "next/navigation";
import SignupForm from "./signupForm";

export default async function Signup({ params }) {
    const { role } = await params;

    if (!["manager", "qa", "developer"].includes(role)) {
        notFound();
    }

    return <SignupForm role={role} />;
}
