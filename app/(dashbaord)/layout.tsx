'use client';

import React, { useState } from 'react';

// Components
// import CopyRight from '@/components/organisms/CopyRight';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar/Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);

  return (
    <>
      <Sidebar isOpen={isOpen} isHidden={isHidden} setIsHidden={setIsHidden} />
      <div className="overflow-x-hidden">
        <div
          className={`absolute ${isOpen ? 'left-[70px] w-[calc(100%_-_70px)]' : 'left-0 w-full lg:left-[240px] lg:w-[calc(100%_-_240px)]'} transition-width-left duration-300`}
        >
          <Header isOpen={isOpen} setIsOpen={setIsOpen} setIsHidden={setIsHidden} />
          <div className="min-h-[calc(100vh_-_100px)] p-3">{children}</div>
          {/* <CopyRight /> */}
        </div>
      </div>
    </>
  );
};

export default Layout;
