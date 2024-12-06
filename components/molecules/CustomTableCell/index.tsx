import { FC, PropsWithChildren } from 'react';

// Utils
import { removeHyphensUnderscoresAndMakeCamelCase, formatDate } from '@/utils/helper';

// Components
import Badge from '@/components/atoms/Badge';
import Text from '@/components/atoms/commonText';
// import ActionDropdown from '@/components/atoms/ActionDropdown';

// Types
import { CustomTableCellProps } from '@/types/commonTypes';
import { CUSTOM_CELL_TYPE } from '@/utils/enums';

// Icons
import { Eye, Trash, Edit } from 'iconsax-react';

const CustomTableCell: FC<PropsWithChildren<CustomTableCellProps>> = ({
  children,
  type,
  variant,
  onView,
  onEdit,
  onDelete,
  data,
  rowkey,
  align,
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
        <div className="flex items-center justify-center gap-2">
          {onView && (
            <Eye
              size="20"
              onClick={() => onView(data)}
              className="cursor-pointer text-primary-500 duration-200 hover:scale-105 hover:text-primary-600"
            />
          )}
          {onEdit && (
            <Edit
              size="20"
              onClick={() => onEdit(data)}
              className="cursor-pointer text-primary-500 duration-200 hover:scale-105 hover:text-primary-600"
            />
          )}
          {onDelete && (
            <Trash
              size="20"
              onClick={() => onDelete(data)}
              className="cursor-pointer text-danger-500 duration-200 hover:scale-105 hover:text-danger-600"
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

    case CUSTOM_CELL_TYPE.IMAGE:
      return <img src={children as string} className="size-16 min-w-16" />;

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
