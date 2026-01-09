"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useAuth({ redirectToDashboardIfLoggedIn = false } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          if (pathname !== "/login") {
            router.push("/login");
            toast.info("Please login to continue");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
        if (pathname !== "/login") router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  useEffect(() => {
    if (isLoggedIn && (redirectToDashboardIfLoggedIn || pathname === "/login")) {
      router.push("/dashboard/projects");
    }
  }, [isLoggedIn, redirectToDashboardIfLoggedIn, pathname, router]);

  return { loading, isLoggedIn };
}
