/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { Spinner } from '@nextui-org/react';

// Components
import Button from '../Button';
import Text from '../commonText';

// Icons
import { BiPlus } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';

// Utils
import debounce from 'debounce';
import { SelectClan } from '@/components/SelectClan';
import { SelectProduct } from '@/components/SelectProduct';

type HeadingProps = {
  title: string;
  buttonClick?: () => void;
  buttonText?: string;
  search?: string;
  setSearch?: (value: string) => void;
  clanId?: number;
  setClanId?: (value: number) => void;
  productId?: string;
  setProductId?: (value: string) => void;
};

const Heading = ({
  title,
  buttonClick,
  buttonText,
  search,
  setSearch,
  clanId,
  setClanId,
  productId,
  setProductId,
}: HeadingProps) => {
  const [searchInput, setSearchInput] = useState(search || '');
  const [loading, setLoading] = useState(false);

  const debouncedSetSearch = debounce(value => {
    if (setSearch) setSearch(value);
    setLoading(false);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
    setLoading(true);
  };

  const showFilters = setSearch || setClanId || setProductId;
  return (
    <>
      <div className="mb-6 flex items-center justify-between pr-2">
        <Text containerTag="h1" className="text-lg font-medium text-blackColor">
          {title}
        </Text>
      </div>

      {(showFilters || buttonText) && (
        <div className="mb-5 flex items-center justify-between">
          {setSearch && (
            <div className="relative flex w-80 items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleChange}
                className="h-10 w-full rounded-md border-4 border-none border-grayColor5 bg-grayColor5 pl-4 pr-14 text-base outline-none"
              />
              <div className="absolute right-[3px] flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shadow-purpleShadow">
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <AiOutlineSearch className="m-auto h-5 w-5 text-white" />
                )}
              </div>
            </div>
          )}
          {!showFilters && <div />}
          {setClanId && <SelectClan value={clanId!} onChange={setClanId} />}
          {setProductId && <SelectProduct value={productId!} onChange={setProductId} />}
          {buttonText && (
            <Button size="md" onClick={buttonClick}>
              <BiPlus className="text-white" />
              {buttonText}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Heading;
