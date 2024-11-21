import Text from '../commonText';

// Images
import Image from 'next/image';
import { EmptyImage } from '@/public/assets/images';

const Empty = () => {
  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3">
      <Image src={EmptyImage} alt="" width={60} height={60} />
      <Text containerTag="p" className="text-sm text-default-400 sm:text-base">
        No Data Available
      </Text>
    </div>
  );
};

export default Empty;
