import { ToastContainer } from "react-toastify";
import "./app.css";
import Image from "next/image";

export default function PublicLayout({ children }) {
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
      {children}
      <ToastContainer />
    </div>
  );
}
