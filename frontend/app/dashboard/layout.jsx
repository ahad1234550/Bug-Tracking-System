import Header from "./component/header/page";
import "./layout.css";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard pages",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
