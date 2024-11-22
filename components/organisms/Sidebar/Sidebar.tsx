import React from 'react';

// Icons
import { CloseCircle } from 'iconsax-react';

// Components
import Text from '@/components/atoms/commonText';

// Data
import { SidebarLinks } from '@/components/organisms/Sidebar/sidebar-data';

// Next
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Images
import Image from 'next/image';
import { Logo } from '@/public/assets/images';

type SidebarIF = {
  isOpen: boolean;
  isHidden: boolean;
  setIsHidden: (_isHidden: boolean) => void;
};

const Sidebar: React.FC<SidebarIF> = ({ isOpen, isHidden, setIsHidden }) => {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`absolute left-[-900px] top-0 z-30 h-screen border-r border-lightGray bg-background duration-300 lg:fixed lg:left-0 ${isOpen ? 'w-[70px]' : 'w-[240px]'} ${
          isHidden && 'left-[0px]'
        } `}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-r border-content2 p-4`}
        >
          <div
            className={`lg flex items-center gap-3 pt-1 ${isOpen ? 'pl-[6px]' : 'pl-0'}`}
          >
            <Image src={Logo} alt="Logo" width={26} height={26} />
            {!isOpen && (
              <Text containerTag="h4" className="w-full text-base font-bold uppercase">
                shadownet
              </Text>
            )}
          </div>

          <div
            className="group block cursor-pointer rounded-lg bg-white p-1 lg:hidden"
            onClick={() => setIsHidden(false)}
          >
            <CloseCircle
              size="24"
              color="#5156be"
              className="duration-200 group-hover:rotate-180"
            />
          </div>
        </div>

        <ul className="border-r border-content2 px-3 pt-4">
          {SidebarLinks.map((item, index) => {
            const isActives = pathname.startsWith(item.href);

            return (
              <li
                key={index}
                className={`group flex cursor-pointer items-center py-2 hover:text-primary ${isOpen ? 'pl-[6px]' : 'pl-0'} ${
                  isActives ? 'text-primary' : 'text-black'
                }`}
              >
                <Link
                  href={item.href}
                  className="relative flex items-center gap-4 p-1 text-sm"
                >
                  <div>{item.icon}</div>

                  <Text
                    containerTag="span"
                    className={`cursor-pointer whitespace-nowrap font-normal capitalize ${isOpen ? 'invisible absolute left-10 flex h-full w-max items-center justify-center rounded-md bg-primary p-2 text-xs text-white opacity-0 group-hover:visible group-hover:opacity-100' : 'realative'}`}
                  >
                    {isOpen && (
                      <span className="absolute left-[-4px] z-[-1] h-[10px] w-[10px] rotate-45 border border-content2 bg-primary shadow-lg" />
                    )}
                    {item.title}
                  </Text>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
