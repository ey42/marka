import { cn } from '@/lib/utils';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={cn("border-2 dark:border-white border-black px-2 rounded-md", {
                        "bg-black text-white dark:text-black dark:bg-white": i === currentPage,
                    })}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="flex gap-3 font-bold">
            <button onClick={handlePrevious} disabled={currentPage === 1} className={cn("border-2 mr-6 border-black dark:border-white px-2 rounded-md dark:bg-white bg-black text-white dark:text-black", {
            "dark:bg-white/50 dark:text-black/50 bg-black/50 text-white/50 border-none": currentPage === 1,
            
            })}>
                previous
            </button>
            {renderPageNumbers()}
            <button  onClick={handleNext} disabled={currentPage === totalPages} className={cn("border-2 border-black dark:border-white px-2 rounded-md ml-6 dark:bg-white bg-black text-white dark:text-black", {
                "dark:bg-white/50 dark:text-black/50 bg-black/50 text-white/50 border-none": currentPage === totalPages,
})}>
                Next
            </button>
        </div>
    );
};

export default PaginationComponent;         