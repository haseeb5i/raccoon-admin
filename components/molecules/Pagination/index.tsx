import { Pagination } from '@nextui-org/react';
import { FC } from 'react';

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage(_page: number): void;
  rowsPerPage: number;
  setRowsPerPage(_page: number): void;
}

const CustomPagination: FC<CustomPaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Pagination
        color="primary"
        page={currentPage}
        total={totalPages}
        onChange={page => setCurrentPage(page)}
        className="text-base font-medium"
        classNames={{
          item: ['!text-default-400', '!font-bold', 'h-10', 'w-10'],
          cursor: ['h-10', 'w-10'],
        }}
      />

      {/* Pagination No of Rows Selection */}
      <div className="flex h-10 items-center justify-between rounded-xl bg-default-100 px-2 py-1">
        <label className="flex items-center gap-2 text-base font-medium text-default-500">
          Show
          <select
            className="rounded-lg bg-primary-foreground p-1 text-small text-default-500 outline-none"
            value={rowsPerPage}
            onChange={e => {
              setCurrentPage(1);
              setRowsPerPage(parseInt(e.target.value));
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default CustomPagination;
