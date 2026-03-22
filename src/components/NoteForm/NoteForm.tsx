import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient} from '@tanstack/react-query';
import { createNote, type createNoteDto } from '../../services/noteService';
import css from './NoteForm.module.css';

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Required'),
  content: Yup.string().max(500),
  tag: Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']).required('Required'),
});

interface NoteFormProps {  
  onCancel: () => void;
}

export const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as const }}
      validationSchema={validationSchema}
      onSubmit={(values: createNoteDto) => mutate(values)}
    >
      <Form className={css.form}>
        {/* Поля форми залишаються  */}
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field name="title" className={css.input} id="title" />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>
        <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field name="content" as="textarea" rows={8} className={css.textarea} id="content" />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field name="tag" as="select" className={css.select} id="tag">
              {['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>
        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>Cancel</button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
};