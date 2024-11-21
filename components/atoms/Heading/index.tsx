/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useCallback, useState } from 'react';
import { Spinner } from '@nextui-org/react';

// Components
import Button from '../Button';
import Text from '../commonText';

// Icons
import { BiPlus } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai';

// Utils
import debounce from 'debounce';

const Heading = ({
  title,
  buttonClick,
  buttonText,
  search,
  setSearch,
}: {
  title: string;
  buttonClick?: () => void;
  buttonText?: string;
  search?: string;
  setSearch?: (value: string) => void;
}) => {
  const [searchInput, setSearchInput] = useState(search || '');
  const [loading, setLoading] = useState(false);

  const debouncedSetSearch = useCallback(
    debounce(value => {
      if (setSearch) setSearch(value);
      setLoading(false);
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
    setLoading(true);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between pr-2">
        <Text containerTag="h1" className="text-lg font-medium text-blackColor">
          {title}
        </Text>
      </div>

      {(buttonText || search) && (
        <div className="mb-5 flex items-center justify-between">
          <div className="relative flex w-80 items-center">
            {setSearch && (
              <>
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
              </>
            )}
          </div>

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
