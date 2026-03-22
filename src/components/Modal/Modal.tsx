import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root') as HTMLElement;

export const Modal = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.code === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    
    
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; 
    };
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
};