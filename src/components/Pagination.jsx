import { useEffect, useState } from "react";
import styles from "../styles/pagination.module.css"
const Pagination = ({ data, renderItem }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const TOTAL_TRANSACTION_PER_PAGE = 10;

  const totalPages = Math.ceil(data.length / TOTAL_TRANSACTION_PER_PAGE);

  const indexOfLastItem = currentPage * TOTAL_TRANSACTION_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - TOTAL_TRANSACTION_PER_PAGE;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, data);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const content = currentItems.map((item, index) => renderItem(item, index));

  
 // Inside your Pagination component
const renderPaginationControls = () => {
    // Don't show pagination at all if there's only one page
    if (totalPages <= 1) {
      return null;
    }
    
    // Determine which page numbers to show
    const pageButtons = [];
    
    // Always show previous button
    pageButtons.push(
     
    );
    
    // Function to add a page button
    const addPageButton = (pageNum) => {
      pageButtons.push(
        <button
          key={pageNum}
          onClick={() => paginate(pageNum)}
          className={`${styles.number} ${styles.page_btn} ${currentPage === pageNum ? `${styles.active}` : ''}`}
        >
          {pageNum}
        </button>
      );
    };
    
    // Function to add ellipsis
    const addEllipsis = (key) => {
      pageButtons.push(
        <span key={`ellipsis-${key}`} className={styles.ellipsis}>...</span>
      );
    };
    
    // Logic for showing relevant page numbers
    // For small number of pages, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        addPageButton(i);
      }
    } 
    // For larger numbers, be selective
    else {
      // Always show first page
      addPageButton(1);
      
      // Complex logic for middle pages
      if (currentPage <= 3) {
        // Near the start
        addPageButton(2);
        addPageButton(3);
        addEllipsis('end');
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        addEllipsis('start');
        addPageButton(totalPages - 2);
        addPageButton(totalPages - 1);
      } else {
        // In the middle
        addEllipsis('start');
        addPageButton(currentPage);
        addEllipsis('end');
      }
      
      // Always show last page
      addPageButton(totalPages);
    }
    
    // Always show next button
    pageButtons.push(
      
    );
    
    return (
      <div className={styles.pagination_controls}>
       
        <button 
        key="prev"
        onClick={prevPage} 
        disabled={currentPage === 1}
        className={`${styles.page_btn} ${styles.page_arrow} ${styles.prev_page}`}
      >
        &#9664;
        <span className={styles.prev}>Prev</span>
      </button>
   
        <div className={styles.button_container}>
        {pageButtons}
        </div>
      
        <button 
        key="next"
        onClick={nextPage} 
        disabled={currentPage === totalPages}
        className={`${styles.page_btn} ${styles.page_arrow} ${styles.next_page}`}
      >
        <span className={styles.next}>Next</span>
        &#9654; 
      </button>
      </div>
    );
  };
  
  // Use the function to generate controls
  const controls = renderPaginationControls();

  return {
    content,
    controls,
    currentItems,
    pagination: {
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      paginate,
    },
  };
};

export default Pagination;
