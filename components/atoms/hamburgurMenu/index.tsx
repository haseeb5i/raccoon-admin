import React from 'react';

type PropsType = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const HamburgurMenu = ({ isActive, setIsActive }: PropsType) => {
  return (
    <div
      className="hidden h-8 w-8 cursor-pointer flex-col items-center justify-between px-1 py-[7px] lg:flex"
      onClick={() => setIsActive(!isActive)}
    >
      <div
        className={`h-[3px] w-full rounded-2xl bg-primary duration-500 ${
          isActive ? 'translate-y-[7px] rotate-[223deg] transform' : ''
        }`}
      />
      <div
        className={`h-[3px] w-full rounded-2xl bg-primary ${isActive ? 'hidden' : 'block'}`}
      />
      <div
        className={`h-[3px] w-full rounded-2xl bg-primary duration-500 ${
          isActive ? 'translate-y-[-8px] -rotate-[223deg] transform' : ''
        }`}
      />
    </div>
  );
};

export default HamburgurMenu;
