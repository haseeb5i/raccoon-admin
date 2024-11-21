import { FC, PropsWithChildren } from 'react';

// Utils
import { removeHyphensUnderscoresAndMakeCamelCase, formatDate } from '@/utils/helper';

// Components
import Badge from '../../atoms/Badge';
import Text from '@/components/atoms/commonText';
import ActionDropdown from '@/components/atoms/ActionDropdown';

// Types
import { CUSTOM_CELL_TYPE, CustomTableCellProps } from '@/types/commonTypes';

// Icons
import { Eye, Trash } from 'iconsax-react';

const CustomTableCell: FC<PropsWithChildren<CustomTableCellProps>> = ({
  children,
  type,
  variant,
  onView,
  onEdit,
  onDelete,
  customActionMenu,
  data,
  TrashIcon,
  showActionDropdown,
  rowkey,
  align,
  conditionalType,
  subtext,
}) => {
  if (rowkey === 'fieldNotInApi') {
    return <div className="text-red-500">Field not found in API 🤫</div>;
  }

  switch (type) {
    case CUSTOM_CELL_TYPE.TEXT:
      return (
        <div className={`text-${align} text-left`}>
          {children !== undefined && children !== null ? children : ' - '}
        </div>
      );

    case CUSTOM_CELL_TYPE.TEXTWITHSUBTEXT:
      return (
        <div className={`text-${align} flex flex-col`}>
          {children || ' - '}
          <p className="text-[10px] leading-4 text-default-500">{subtext ?? subtext}</p>
        </div>
      );

    case CUSTOM_CELL_TYPE.DEBIT:
      return (
        <div className={`text-${align}`}>
          {children === '-' ? children : `$${children}` || '-'}
        </div>
      );

    case CUSTOM_CELL_TYPE.CREDIT:
      return (
        <div className={`text-${align}`}>
          {children === '-' ? children : `$${children}` || '-'}
        </div>
      );

    case CUSTOM_CELL_TYPE.BADGE:
      return (
        <Badge variant={variant}>
          {removeHyphensUnderscoresAndMakeCamelCase(children as string) || ' - '}
        </Badge>
      );

    case CUSTOM_CELL_TYPE.ACTION:
      return (
        <div className="flex items-center justify-center">
          {TrashIcon && (
            <Trash
              size="24"
              onClick={onDelete}
              className="cursor-pointer text-danger-500 duration-200 hover:scale-105 hover:text-danger-600"
            />
          )}
          {showActionDropdown && (
            <ActionDropdown
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              customActionMenu={customActionMenu}
              conditionalType={conditionalType}
              data={data}
            />
          )}
        </div>
      );

    case CUSTOM_CELL_TYPE.LINK:
      return (
        <Text
          containerTag="p"
          className={`text-sm ${children && 'text-primary-500 underline'}`}
        >
          {children || ' - '}
        </Text>
      );

    case CUSTOM_CELL_TYPE.DATE:
      return <div>{formatDate(children as string)}</div>;

    case CUSTOM_CELL_TYPE.EYE:
      return (
        <div className="flex justify-center">
          <Eye size="24" className="text-default-400" />
        </div>
      );

    case CUSTOM_CELL_TYPE.DESCRIPTOR:
      return (
        <div className="">
          <Text containerTag="p">{children || ' - '}</Text>
        </div>
      );

    default:
      return <div>{children || ' - '}</div>;
  }
};

export default CustomTableCell;
