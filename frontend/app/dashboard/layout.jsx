"use client";
import { ToastContainer } from "react-toastify";
import Header from "./component/header/page";
import "./layout.css";
import useAuth from "@/app/hooks/useAuth";

export default function DashboardLayout({ children }) {
  const { loading, isLoggedIn } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!isLoggedIn) return null;

  return (
    <>
      <Header />
      <main>{children}</main>
      <ToastContainer />
    </>
  );
}
