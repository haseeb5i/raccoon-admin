import Text from '@/components/atoms/commonText';
import { ActivityChart } from './chart';
import { DataCards } from './cards';

export default function Page() {
  return (
    <>
      <Text containerTag="h1" className="mb-4 text-lg font-medium text-blackColor">
        Dashboard
      </Text>
      <DataCards />
      <div className="grid gap-4 md:grid-cols-2">
        <ActivityChart />
      </div>
    </>
  );
}
