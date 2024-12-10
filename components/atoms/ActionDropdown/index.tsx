/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, useMemo } from 'react';

// Icons
import { More } from 'iconsax-react';

// Types
import { ActionDropdownProps } from '@/types/commonTypes';
import { dropDownMenus } from '@/types/dropDownTypes';

// Components
import CustomDropdown from '../Dropdown';

const ActionDropdown: FC<ActionDropdownProps> = ({
  onView,
  onEdit,
  onDelete,
  customActionMenu,
  data,
  conditionalType,
}) => {
  const dropDownMenus: dropDownMenus[] = [];

  if (onView) {
    dropDownMenus.push({
      title: 'View',
      key: 'view',
      onClick: () => {
        onView(data);
      },
    });
  }

  if (onEdit) {
    dropDownMenus.push({
      title: 'Edit',
      key: 'edit',
      onClick: () => {
        onEdit(data);
      },
    });
  }

  if (onDelete) {
    dropDownMenus.push({
      title: 'Delete',
      key: 'delete',
      className: 'text-danger',
      color: 'danger',
      onClick: () => {
        onDelete(data);
      },
    });
  }

  const getMenuItems = (menu: dropDownMenus, data: any) => ({
    title: menu.title,
    key: menu.key,
    className: menu.className,
    color: menu.color,
    onClick: () => menu.onClick?.(data),
  });

  useMemo(() => {
    if (!customActionMenu) return [];

    if (customActionMenu) {
      if (conditionalType === 'document_table') {
        customActionMenu.forEach((menu: dropDownMenus) => {
          if (data?.status === 'queued' && menu.key === 'Cancel') {
            dropDownMenus.push(getMenuItems(menu, data));
          } else if (
            menu.key === 'Delete' &&
            (data?.status === 'Error' || data?.status === 'Cancelled')
          ) {
            dropDownMenus.push(getMenuItems(menu, data));
          } else if (
            menu.key !== 'Cancel' &&
            menu.key !== 'Delete' &&
            data?.status !== 'Error' &&
            data?.status !== 'Cancelled' &&
            data?.status !== 'queued'
          ) {
            dropDownMenus.push(getMenuItems(menu, data));
          }
        });
      } else {
        customActionMenu.forEach((menu: dropDownMenus) => {
          dropDownMenus.push(getMenuItems(menu, data));
        });
      }
    }
  }, [customActionMenu, conditionalType, data ]);

  return (
    <CustomDropdown
      dropDownButton={<More size="24" className="ml-auto flex text-default-400" />}
      dropDownMenus={dropDownMenus as dropDownMenus[]}
    />
  );
};

export default ActionDropdown;
