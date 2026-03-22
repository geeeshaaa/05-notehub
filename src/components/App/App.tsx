import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import * as noteService from '../../services/noteService';
import { NoteList } from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';
import { SearchBox } from '../SearchBox/SearchBox';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';
import css from './App.module.css';

export const App = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Дебаунс для пошуку
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку при пошуку
  }, 500);

  // Запит даних
  const { data, isLoading } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => noteService.fetchNotes(page, 12, search),
  });

  // Мутації
  const createMutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: noteService.deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => debouncedSearch(e.target.value)} />
        {data && data.totalPages > 1 && (
          <Pagination 
            pageCount={data.totalPages} 
            onPageChange={({ selected }) => setPage(selected + 1)} 
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
      </header>

      {isLoading && <p>Loading...</p>}
      
      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={(id) => deleteMutation.mutate(id)} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm 
            onCancel={() => setIsModalOpen(false)} 
            onSubmit={(values) => createMutation.mutate(values)} 
          />
        </Modal>
      )}
    </div>
  );
};