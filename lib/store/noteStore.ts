// lib/store/noteStore.ts
import type { DraftNote } from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Todo",
};

interface DraftNoteStore {
  draft: DraftNote;
  setDraft: (draft: DraftNote) => void;
  clearDraft: () => void;
}

export const useDraftNote = create<DraftNoteStore>()(
  persist(
    (set) => ({
      draft: { ...initialDraft },
      setDraft: (newDraft: DraftNote) => set({ draft: newDraft }),
      clearDraft: () => set({ draft: { ...initialDraft } }),
    }),
    {
      name: "draft-note",
    }
  )
);
