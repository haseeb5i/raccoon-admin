import Text from '@/components/atoms/commonText';
import Link from 'next/link';

const CopyRight = () => {
  return (
    <div className="flex w-full items-center justify-end py-3 text-[10px] font-normal text-lightBlack sm:text-xs">
      <Text
        containerTag="p"
        className="cursor-pointer border-r-2 border-foreground pr-2 text-lightBlack duration-100 hover:text-primary"
      >
        © 2021 Shadownet
      </Text>
      <Link
        href="/terms-of-service"
        className="cursor-pointer border-r-2 border-foreground pl-2 pr-2 text-lightBlack duration-100 hover:text-primary"
      >
        Terms of Service
      </Link>
      <Link
        href={'/privacy-policy'}
        className="cursor-pointer pl-2 pr-8 text-lightBlack duration-100 hover:text-primary"
      >
        Privay Policy
      </Link>
    </div>
  );
};

export default CopyRight;
