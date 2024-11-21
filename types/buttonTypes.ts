export type ButtonPropsType = {
  type?: 'button' | 'submit' | 'reset' | undefined;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger' | undefined;
  variant?: 'bordered' | 'faded' | 'ghost' | 'flat' | 'solid' | 'solid' | 'light' | undefined;
  fullWidth?: boolean;
  radius?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  onClick?: (_e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  leadingIcon?: React.ReactNode;
  fontWeigth?: 'light' | 'normal' | 'medium' | 'bold' | 'extrabold';
  bgColor?: string;
  padding?: string;
  isIconOnly?: boolean;
};
