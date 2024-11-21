/* eslint-disable @typescript-eslint/no-explicit-any */

// Next UI
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

// Types
import { dropDownProps } from '@/types/dropDownTypes';

const CustomDropdown = (props: dropDownProps) => {
  const { placement, dropDownButton, dropDownMenus, selected, setSelected } = props;

  return (
    <Dropdown
      placement={placement || 'bottom-end'}
      aria-label="dropdown"
      shouldBlockScroll={false}
    >
      <DropdownTrigger>{dropDownButton}</DropdownTrigger>

      <DropdownMenu
        variant="flat"
        selectionMode="single"
        selectedKeys={selected ? [selected] : []}
        onSelectionChange={setSelected as any}
        aria-label="dropdown"
      >
        {dropDownMenus?.flatMap(option => {
          if (option?.section) {
            return option?.section?.map((link, index) => (
              <DropdownItem
                key={index}
                aria-label={link.title}
                href={link.href}
                startContent={link.icon}
                onClick={link.onClick}
              >
                {link.title}
              </DropdownItem>
            ));
          }
          return (
            <DropdownItem
              key={option.title}
              aria-label={option.title}
              className={option?.className || undefined}
              color={option.color || undefined}
              startContent={option?.icon || undefined}
              onClick={option?.onClick || undefined}
            >
              {option.title}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CustomDropdown;
