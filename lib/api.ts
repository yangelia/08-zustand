import axios from "axios";
import type { Note, CreateNoteRequest } from "@/types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_URL = "https://notehub-public.goit.study/api/notes";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export const fetchNotes = async (
  page: number = 1,
  search: string = "",
  perPage: number = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("perPage", perPage.toString());

  if (search) {
    params.append("search", search);
  }

  if (tag && tag !== "all") {
    params.append("tag", tag);
  }

  const queryString = params.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  const res = await axios.get<FetchNotesResponse>(url, { headers });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`${API_URL}/${id}`, { headers });
  return res.data;
};

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  const res = await axios.post<Note>(API_URL, note, { headers });
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(`${API_URL}/${id}`, { headers });
  return res.data;
};
