export type dropDownProps = {
  placement?:
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end';
  dropDownButton: React.ReactNode;
  dropDownMenus: dropDownMenus[];
  selected?: string;
  setSelected?: (_value: Set<string>) => void;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type dropDownMenus = {
  key: string;
  title?: string;
  className?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  section?: dropDownMenus[];
  sectionTitle?: string;
  hasDivider?: boolean;
  href?: string;
  icon?: React.ReactNode;
  onClick?: (_data?: any) => void;
};
