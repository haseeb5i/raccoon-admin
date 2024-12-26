'use client';

import { useGetDashboardQuery } from '@/redux/slice/dashSlice';
import { Card, Skeleton } from '@nextui-org/react';

export const DataCards = () => {
  const { data, isLoading } = useGetDashboardQuery({});

  return (
    <div className="mb-4 grid gap-4 lg:grid-cols-4">
      <Card className="p-4">
        {isLoading ? (
          <Skeleton className="h-6 w-28" />
        ) : (
          <p className="text-lg font-bold">{data?.totalUsers}</p>
        )}
        <p className="mt-2 text-sm">Total Users</p>
        {/* create spark */}
      </Card>
      <Card className="p-4">
        {isLoading ? (
          <Skeleton className="h-6 w-28" />
        ) : (
          <p className="text-lg font-bold">{data?.totalPlayers}</p>
        )}
        <p className="mb-2 text-sm">Total Users</p>
        {/* create spark */}
      </Card>
    </div>
  );
};
