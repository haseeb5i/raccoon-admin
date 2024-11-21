import { FieldErrors } from 'react-hook-form';

export type TextAreaType = {
  label?: string;
  onChange?: () => void;
  className?: {
    label?: string;
    input?: string[];
    inputWrapper?: string;
  };
  name?: string;
  disabled?: boolean;
  field: {
    name: string;
    value: string | number | undefined;
    onChange: (_value: string) => void;
    onBlur: () => void;
  };
  errors?: FieldErrors | undefined;
  required?: boolean;
  placeholder?: string;
  color?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  fullWidth?: boolean;
  variant?: 'bordered' | 'faded' | 'underlined' | 'flat';
  width?: string;
  showErrorMessage?: boolean;
  size?: 'sm' | 'md' | 'lg';
};
