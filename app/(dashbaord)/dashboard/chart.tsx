'use client';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card, Skeleton } from '@nextui-org/react';
import { useGetDashboardQuery } from '@/redux/slice/dashSlice';
import { useMemo } from 'react';

export const ActivityChart = () => {
  const { data, isLoading } = useGetDashboardQuery({});

  const series = useMemo(() => {
    if (!data) return [];
    return [
      {
        name: 'Active',
        data: data.activeUsers,
      },
      {
        name: 'New',
        data: data.newUsers,
      },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <Card id="chart" className="p-4">
        <Skeleton className="h-[430px] rounded-large" />
      </Card>
    );
  }

  return (
    <Card id="chart" className="p-4">
      <Chart options={options} series={series} type="bar" />
    </Card>
  );
};

const options: ApexOptions = {
  title: {
    text: 'Monthly Users',
  },
  chart: {
    type: 'bar',
    height: 430,
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top',
      },
    },
  },
  xaxis: {
    labels: {
      formatter: function (value) {
        const x = new Date(value);
        return `${x.getDay()}/${x.getMonth()}`;
      },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: {
      fontSize: '12px',
      colors: ['#fff'],
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['#fff'],
  },
  tooltip: {
    intersect: false,
    shared: true,
  },
};
