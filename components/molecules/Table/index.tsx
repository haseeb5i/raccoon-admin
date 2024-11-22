'use client';

/* eslint-disable no-prototype-builtins */
import { useMemo, useState } from 'react';

// NextUI
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react';

// Components
import CustomPagination from '../Pagination';
import CustomTableCell from '../CustomTableCell';
import CustomSkeleton from '@/components/atoms/Skeleton';
import Empty from '@/components/atoms/Empty';

// Utils
import { CUSTOM_CELL_TYPE, SKELETON_VARIANT, STATUS } from '@/utils/enums';
import { statusVariant } from '@/utils/constant';
import { removeWhiteSpaces, sortArray } from '@/utils/helper';

// Types
import {
  CustomTableProps,
  TableColumnTypes,
  TableSortTypes,
} from '@/types/commonTypes';

const CustomTable = ({
  selectionMode = 'none',
  columns,
  rows,
  showPagination = true,
  isLoading = false,
  isEmpty = false,
  onRowClick,
  customActionMenu,
  onDelete,
  onView,
  onEdit,
  TrashIcon,
  showActionDropdown = true,
  totalCount = 0,
  pagination = { page: 1, limit: 10 },
  setPagination = () => {},
  selectedRows,
  setSelectedRows,
  conditionalType,
}: CustomTableProps) => {
  const [sort, setSort] = useState<TableSortTypes>({
    field: '',
    type: '',
    count: -1,
  });

  const setSortOption = (column: TableColumnTypes) => {
    if (column.type !== CUSTOM_CELL_TYPE.ACTION) {
      setSort(prev => {
        if (prev.field === column.key && prev.count === 1) {
          return { field: '', type: '', count: -1 };
        } else if (prev.field !== column.key && prev.count >= 0) {
          return {
            field: column.key,
            type: column.type,
            count: 0,
          } as TableSortTypes;
        }
        return {
          field: column.key,
          type: column.type,
          count: prev.count + 1,
        } as TableSortTypes;
      });
    }
  };

  const items = useMemo(() => {
    if (rows) {
      if (sort.field && sort.count >= 0) {
        if (sort.type === CUSTOM_CELL_TYPE.DATE) {
          return sortArray(rows, sort.field, sort.count === 0 ? 'asc' : 'desc', 'date');
        }

        return sortArray(rows, sort.field, sort.count === 0 ? 'asc' : 'desc', 'date');
      }

      return rows;
    }
  }, [rows, sort]);

  const classNames = useMemo(
    () => ({
      wrapper: [''],
      th: [
        'bg-primary',
        'text-white',
        'text-xs',
        'font-semibold',
        selectionMode === 'multiple' && 'first-of-type:!w-1',
      ],
      td: ['text-foreground', 'text-sm', 'py-[18px]'],
      tr: [onRowClick && 'cursor-pointer', 'border-b', 'border-b-default-100'],
    }),
    [selectionMode, onRowClick]
  );

  const columnsMap = useMemo(
    () =>
      new Map(
        columns.map(col => {
          return [col.key, { type: col.type, align: col.align, subItem: col.subItem }];
        })
      ),
    [columns]
  );

  if (isLoading) return <CustomSkeleton variant={SKELETON_VARIANT.TABLE} />;

  if (isEmpty) return <Empty />;

  return (
    <>
      <Table
        aria-label="Table"
        selectionMode={selectionMode}
        classNames={classNames}
        color="primary"
        selectedKeys={selectedRows}
        onSelectionChange={setSelectedRows}
        checkboxesProps={{
          classNames: {
            wrapper: 'before:border-content3',
          },
        }}
      >
        <TableHeader columns={columns}>
          {column => {
            return (
              <TableColumn
                align="center"
                key={column.key}
                className={`${column?.align ? `flex justify-${column.align}` : ''}`}
              >
                <button
                  className={`flex cursor-pointer items-center gap-1 ${
                    column.type === CUSTOM_CELL_TYPE.ACTION &&
                    'flex w-full items-center justify-end'
                  }`}
                  onClick={() => setSortOption(column)}
                >
                  {column.label}
                  {column.type !== CUSTOM_CELL_TYPE.ACTION &&
                    column.type !== CUSTOM_CELL_TYPE.EYE && (
                      <span>
                        {/* <img src={Sort} alt="Sort" className="h-3 w-2" /> */}
                      </span>
                    )}
                </button>
              </TableColumn>
            );
          }}
        </TableHeader>
        <TableBody items={items}>
          {item => (
            <TableRow
              key={item.key}
              onClick={() => onRowClick && onRowClick(item)}
              className="last:border-none"
            >
              {columnKey => {
                const currentCellType =
                  columnsMap.get(columnKey.toString())?.type ?? CUSTOM_CELL_TYPE.TEXT;

                const align = columnsMap.get(columnKey.toString())?.align;

                let currentCellBadgeVariant;
                if (
                  currentCellType === CUSTOM_CELL_TYPE.BADGE &&
                  rows.hasOwnProperty(columnKey as string)
                ) {
                  currentCellBadgeVariant =
                    statusVariant[
                      removeWhiteSpaces(
                        getKeyValue(item, columnKey),
                        true
                      ).toUpperCase() as STATUS
                    ];
                }

                let subItemText = '';
                if (currentCellType === CUSTOM_CELL_TYPE.TEXTWITHSUBTEXT) {
                  subItemText =
                    columnsMap.get(columnKey.toString())?.subItem?.label +
                    item?.[columnsMap.get(columnKey.toString())?.subItem?.key ?? ''];
                }

                // Only for Journal Entries Table
                let customData = null;
                if (currentCellType === CUSTOM_CELL_TYPE.DEBIT) {
                  if (item?.debitCredit === CUSTOM_CELL_TYPE.DEBIT) {
                    customData = getKeyValue(item, columnKey);
                  } else {
                    customData = '-';
                  }
                } else if (currentCellType === CUSTOM_CELL_TYPE.CREDIT) {
                  if (item?.debitCredit === CUSTOM_CELL_TYPE.CREDIT) {
                    customData = getKeyValue(item, columnKey);
                  } else {
                    customData = '-';
                  }
                }

                return (
                  <TableCell>
                    <CustomTableCell
                      rowkey={columnKey as string}
                      type={currentCellType}
                      align={align}
                      variant={currentCellBadgeVariant}
                      customActionMenu={customActionMenu}
                      onDelete={onDelete}
                      onView={onView}
                      onEdit={onEdit}
                      data={item}
                      TrashIcon={TrashIcon}
                      showActionDropdown={showActionDropdown}
                      conditionalType={conditionalType}
                      subtext={subItemText}
                    >
                      {customData || getKeyValue(item, columnKey)}
                    </CustomTableCell>
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="mt-8">
          <CustomPagination
            totalPages={Math.ceil(totalCount / pagination.limit)}
            currentPage={pagination.page}
            setCurrentPage={page => setPagination({ ...pagination, page })}
            rowsPerPage={pagination.limit}
            setRowsPerPage={limit => setPagination({ ...pagination, limit })}
          />
        </div>
      )}
    </>
  );
};

export default CustomTable;
