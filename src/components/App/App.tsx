import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {useDebouncedCallback} from 'use-debounce'
import { Pagination } from '../Pagination/Pagination';
import { SearchBox } from '../SearchBox/SearchBox';
import { fetchNotes } from '../../services/noteService';
import { NoteList } from '../NoteList/NoteList';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';
import css from './App.module.css';

  export const App = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedSearch =useDebouncedCallback((value: string)=>{
      setSearch(value);
      setPage(1);
    }, 500);

    const { data, isLoading } = useQuery({
      queryKey: ['notes', page, search],
      queryFn: () => fetchNotes(page, 12, search),
      placeholderData: keepPreviousData, 
    });
  
    return (
      <div className={css.app}>
        <header className={css.toolbar}>
        <SearchBox 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            debouncedSearch(e.target.value)
          } 
        />          
          {data && data.totalPages > 1 && (
            <Pagination 
              pageCount={data.totalPages} 
              currentPage={page} 
              onPageChange={({ selected }) => setPage(selected + 1)} 
            />
          )}
          {/* КНОПКА ВІДКРИТТЯ МОДАЛКИ */}
        <button 
          className={css.button} 
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
        </header>
        <main>
        {isLoading && <p>Loading notes...</p>}
        
        {/* Список нотаток рендериться, якщо є хоча б один елемент */}
        {data && data.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}
      </main>

      {/* МОДАЛЬНЕ ВІКНО З ФОРМОЮ */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
      </div>
    );
  };


  