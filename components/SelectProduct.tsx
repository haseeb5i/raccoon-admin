import { ItemType } from '@/types/commonTypes';
import { Select, SelectItem } from '@nextui-org/react';

type SelectProductProps = {
  value: string;
  onChange: (value: string) => void;
  skipEmpty?: boolean;
};

export const SelectProduct = ({ value, onChange, skipEmpty }: SelectProductProps) => {
  const entries = !skipEmpty ? productTypes : productTypes.slice(1);
  return (
    <Select
      size="sm"
      variant="bordered"
      color="primary"
      classNames={{
        base: 'max-w-xs',
        label: 'text-default-400 text-xs',
        trigger: 'sm:h-[41px] min-h-[41px] h-[41px] border',
        value: 'text-foreground sm:text-xs text-xs',
      }}
      selectedKeys={[value]}
      onSelectionChange={data => {
        if (!data.currentKey) return;
        onChange(data.currentKey);
      }}
      label="Select Type"
    >
      {entries.map(p => (
        <SelectItem key={p.key}>{p.value}</SelectItem>
      ))}
    </Select>
  );
};

const productTypes: Array<{ key: ItemType | 'All'; value: string }> = [
  { key: 'All', value: 'All' },
  { key: 'Arrow', value: 'Arrow' },
  { key: 'Bow', value: 'Bow' },
  // { key: 'PowerUp', value: 'PowerUp' },
];
