"use client";
import { useCallback, useState } from "react";
import Grid from "./grid/page";
import List from "./list/page";
import AddBugModal from "./add_bug_modal";
import { useRouter } from "next/navigation";

export default function BugsClient({
  projectId,
  initialBugs,
  role,
  initialSearch,
}) {
  const router = useRouter();
  const [view, setView] = useState("list");
  const [bugs, setBugs] = useState(initialBugs);
  const [search, setSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refetchBugs = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/bug/${projectId}/readBug?search=${search}`,
      { credentials: "include" }
    );
    if (res.ok) {
      const data = await res.json();
      setBugs(data.data.bugs ?? []);
    }
  }, [projectId, search]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value);
      router.replace(`?search=${value}`);
    },
    [router]
  );

  return (
    <>
      {/* header & search omitted for brevity */}

      {view === "list" && (
        <List bugs={bugs} onBugUpdate={refetchBugs} />
      )}
      {view === "grid" && (
        <Grid bugs={bugs} onBugUpdate={refetchBugs} />
      )}

      {role === "qa" && (
        <AddBugModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={projectId}
          onSuccess={refetchBugs}
        />
      )}
    </>
  );
}
