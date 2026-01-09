import { Geist, Geist_Mono } from "next/font/google";
import Header from "./component/header/page";
import "./layout.css"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard",
  description: "Dashboard pages",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
          {children}
      </body>
    </html>
  );
}
