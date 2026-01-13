"use client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export default function useProject() {
  const [qa, setQA] = useState([]);
  const [developer, setDevelopers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadUsers = useCallback(async () => {
    if (loaded) return;

    try {
      const [qaRes, devRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/getAllQA`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/project/getAllDeveloper`, {
          credentials: "include",
        }),
      ]);

      if (!qaRes.ok || !devRes.ok) {
        throw new Error("Failed to fetch users");
      }

      const qaData = await qaRes.json();
      const devData = await devRes.json();

      setQA(qaData.data || []);
      setDevelopers(devData.data || []);
      setLoaded(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load QA/Developers");
    }
  }, [loaded]);

  return { qa, developer, loadUsers };
}
