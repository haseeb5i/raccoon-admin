'use client';

import { useState } from 'react';

// Components
import Heading from '@/components/atoms/Heading';
import CustomTable from '@/components/molecules/Table';
import ProductModel from './product-model';

// Redux
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from '@/redux/slice/productSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Utils
import { showToast } from '@/utils/toast';

// Types
import { Product, PaginationType, TableColumnTypes } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

const page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [filter, setFilter] = useState<string>('');

  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, isLoading } = useAllProductsQuery({
    type: filter !== 'All' ? filter : undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  const productsData = data?.data ?? [];

  const [deleteData] = useDeleteProductMutation();

  const onDelete = async (id: number) => {
    try {
      const res: {
        data?: { message?: string };
        error?: FetchBaseQueryError | SerializedError;
      } = await deleteData(id);

      if (res?.data) {
        showToast({
          type: 'success',
          message: 'Product deleted successfully',
        });
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onEdit = (data: Product) => {
    setIsEdit(true);
    const filterData = productsData?.filter(item => item.itemId === data.itemId);
    setEditData(filterData?.[0] ?? null);
    setIsOpen(true);
  };

  return (
    <>
      <ProductModel
        open={isOpen}
        setOpen={setIsOpen}
        isEdit={isEdit}
        editData={editData}
      />

      <Heading
        title="Products"
        buttonText="Add Product"
        buttonClick={() => {
          setIsEdit(false);
          setEditData(null);
          setIsOpen(true);
        }}
        productId={filter}
        setProductId={setFilter}
      />

      <CustomTable
        columns={Producttable}
        rows={productsData}
        isLoading={isFetching || isLoading}
        isEmpty={productsData?.length === 0}
        onDelete={(data: Product) => onDelete(data.itemId)}
        onEdit={(data: Product) => onEdit(data)}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
      />
    </>
  );
};

const Producttable: TableColumnTypes[] = [
  {
    key: 'name',
    label: 'Name',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'baseCost',
    label: 'Price',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'imageUrl',
    label: 'Image',
    type: CUSTOM_CELL_TYPE.IMAGE,
  },
  {
    key: 'type',
    label: 'Type',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'soldCount',
    label: 'Sales',
    type: CUSTOM_CELL_TYPE.TEXT,
  },
  {
    key: 'createdAt',
    label: 'Created At',
    type: CUSTOM_CELL_TYPE.DATE,
  },
  {
    key: 'updatedAt',
    label: 'Updated At',
    type: CUSTOM_CELL_TYPE.DATE,
  },
  {
    key: 'action',
    label: 'Action',
    type: CUSTOM_CELL_TYPE.ACTION,
  },
];

export default page;
