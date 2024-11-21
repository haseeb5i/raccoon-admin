import { Textarea as NextUiTextArea } from '@nextui-org/react';

// Components
import Text from '../commonText';

// Types
import { TextAreaType } from '@/types/textAreaTypes';

const TextArea = (props: TextAreaType) => {
  const {
    label,
    disabled,
    field,
    errors,
    required,
    className,
    fullWidth,
    variant,
    color,
    width,
    placeholder,
    showErrorMessage = true,
    size,
  } = props;

  const labelText = required ? `${label}*` : label;

  const styles = {
    label: `${className?.label} text-default-400`,
    input: [
      className?.input,
      'text-foreground sm:text-sm text-xs',
      'placeholder:text-default-400',
      'resize-y min-h-[120px] max-h-[200px]',
    ],
    inputWrapper: [
      'border',
      'rounded-xl',
      'transition-colors',
      'group-data-[focus-within=true]:ring-offset-0',
      'group-data-[invalid=true]:border-danger',
      `${errors && errors[field.name] ? 'bg-lightPink' : 'bg-transparent'}`,
      `${errors && errors[field.name] ? 'border-danger-500 data-[hover=true]:border-danger-500 group-data-[focus=true]:border-danger-500' : 'data-[hover=true]:border-primary group-data-[focus=true]:border-primary'}`,
    ],
  };

  return (
    <>
      <NextUiTextArea
        label={labelText}
        size={size}
        value={field.value as string}
        onChange={e => field.onChange(e.target.value)}
        onBlur={() => field.onBlur()}
        disabled={disabled}
        variant={variant || 'bordered'}
        color={color || 'primary'}
        fullWidth={fullWidth}
        width={width}
        placeholder={placeholder}
        classNames={{ ...styles }}
      />
      {showErrorMessage && errors && errors[field.name] && (
        <Text
          containerTag="h6"
          className="ml-2 mt-1 text-[10px] font-semibold text-danger-500 sm:text-xs"
        >
          {errors?.[field.name]?.message as string}
        </Text>
      )}
    </>
  );
};

export default TextArea;
