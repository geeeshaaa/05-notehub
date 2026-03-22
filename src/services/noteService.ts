import axios from 'axios';
import type {Note, NoteTag} from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];  
  totalPages: number;  
}

export interface createNoteDto{
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (page = 1, perPage = 12, search = ''): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search },
  });
  return data;
};

export const createNote = async (note: createNoteDto): Promise<Note> => {
  const { data } = await noteApi.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};