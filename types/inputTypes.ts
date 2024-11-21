import { Dispatch, SetStateAction } from 'react';
import { FieldErrors } from 'react-hook-form';

export type SuggestionListItem = { name: string; value: string };

export type InputFieldType = {
  widhtFull?: boolean;
  label?: string;
  value?: string;
  onChange?: () => void;
  className?: {
    label?: string;
    input?: string[];
    inputWrapper?: string;
  };
  type?: 'text' | 'password' | 'email' | 'number' | undefined;
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
  endContent?: JSX.Element;
  width?: string;
  leadingIcon?: React.ReactNode;
  showErrorMessage?: boolean;
  onKeyPress?: (_e: React.KeyboardEvent<HTMLInputElement>) => void;
  rigthIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  selectedSuggestionVariant?: 'multiple' | 'single';
  suggestionsList?: SuggestionListItem[];
  renderSuggestionItem?: (_item: SuggestionListItem) => React.ReactNode;
  selectedSuggestions?: SuggestionListItem[];
  setSelectedSuggestions?: Dispatch<SetStateAction<SuggestionListItem[]>>;
  setSelectedSuggestion?: (_item: SuggestionListItem) => void;
  showSuggestions?: boolean;
  setShowSuggestions?: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
};
