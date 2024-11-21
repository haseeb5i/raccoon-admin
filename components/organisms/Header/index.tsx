'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Images
import Image from 'next/image';
import { Profile } from '@/public/assets/images';

// Components
import Text from '@/components/atoms/commonText';
import HamburgurMenu from '@/components/atoms/hamburgurMenu';
import CustomDropdown from '@/components/atoms/Dropdown';

// Utils
import { getCookie, removeCookie } from '@/utils/cookie';
import { SHADOWNET_TOKEN, SHADOWNET_USER } from '@/utils/constant';

// Types
import { UserData } from '@/types/loginTypes';

// Redux
import { useLogoutMutation } from '@/redux/slice/loginSlice';

// Icons
import { IoMdMenu } from 'react-icons/io';

const Header = ({
  isOpen,
  setIsOpen,
  setIsHidden,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  const [logout] = useLogoutMutation({});

  useEffect(() => {
    const userData = getCookie(SHADOWNET_USER);
    setUser(JSON.parse(userData || '{}'));
  }, []);

  const userDropdown = [
    {
      title: 'Profile',
      href: '/profile',
      onClick: () => console.log('profile'),
    },
    {
      title: 'Logout',
      href: '/logout',
      color: 'danger',
      onClick: async () => {
        removeCookie(SHADOWNET_USER);
        removeCookie(SHADOWNET_TOKEN);
        router.push('/login');
        await logout({});
      },
    },
  ];

  return (
    <div className="flex w-full items-center justify-between border-b border-r-2 border-lightGray bg-white p-2">
      <div>
        <HamburgurMenu isActive={isOpen} setIsActive={setIsOpen} />
        <IoMdMenu
          size={32}
          color="#5156be"
          className="block cursor-pointer lg:hidden"
          onClick={() => {
            setIsHidden(true);
            setIsOpen(false);
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col">
          {user && (
            <Text containerTag="h4" className="text-sm font-semibold capitalize">
              {user?.name}
            </Text>
          )}
          <Text containerTag="h6" className="text-[10px]">
            Admin
          </Text>
        </div>

        <div className="relative h-10 w-10 rounded-full bg-white shadow-md">
          <CustomDropdown
            dropDownMenus={userDropdown as []}
            dropDownButton={<Image src={Profile} alt="logo" fill draggable={false} />}
          />
          <Image src={Profile} alt="logo" fill draggable={false} />
        </div>
      </div>
    </div>
  );
};

export default Header;
