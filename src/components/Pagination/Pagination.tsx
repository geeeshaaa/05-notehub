import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';
const ReactPaginateFix = (ReactPaginate as any).default || ReactPaginate;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export const Pagination = ({ pageCount, currentPage, onPageChange }: PaginationProps) => {
  //console.log('ReactPaginate type:', typeof ReactPaginate);
  
  return (
    <ReactPaginateFix
      forcePage={currentPage -1}
      breakLabel="..."
      nextLabel="->"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel="<-"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      pageClassName={css.pageItem} 
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      breakClassName={css.pageItem}
      activeClassName={css.active}
    />
  );
};