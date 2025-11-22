"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "./page.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes(page, search, 12, tag === "all" ? undefined : tag),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className={css.container}>
      <header className={css.toolbar}>
        <div style={{ flex: 1, maxWidth: "400px" }}>
          <SearchBox
            value={search}
            onChange={debouncedSearchChange}
            onClear={handleClearSearch}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isSuccess && data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <Link href="/notes/action/create" className={css.addButton}>
            + Create Note
          </Link>
        </div>
      </header>

      {isLoading && <p>Loading, please wait...</p>}

      {isError && (
        <div className={css.error}>
          Error: {error?.message || "Something went wrong"}
        </div>
      )}

      {isSuccess && data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isSuccess && data && data.notes.length === 0 && <p>No notes found.</p>}
    </div>
  );
}
