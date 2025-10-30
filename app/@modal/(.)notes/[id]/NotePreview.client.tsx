"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

type NotePreviewProps = {
  noteId: string;
};

export default function NotePreview({ noteId }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (isLoading) {
    return (
      <div className={css.overlay} onClick={handleClose}>
        <div className={css.modal}>
          <div className={css.loader}>Loading note...</div>
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className={css.overlay} onClick={handleClose}>
        <div className={css.modal}>
          <div className={css.error}>
            <p>Failed to load note details.</p>
            <button className={css.retryBtn} onClick={() => refetch()}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal}>
        <button className={css.closeButton} onClick={handleClose}>
          ✕
        </button>

        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className={css.content}>{note.content}</div>

          {note.tag && (
            <div>
              <span className={css.tag}>{note.tag}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
