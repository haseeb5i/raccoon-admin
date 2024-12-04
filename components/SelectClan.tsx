import { useAllClansQuery } from '@/redux/slice/clanSlice';
import { Select, SelectItem } from '@nextui-org/react';
import { useMemo } from 'react';

type SelectClanProps = {
  value: number;
  onChange: (value: number) => void;
};

export const SelectClan = ({ value, onChange }: SelectClanProps) => {
  const { data, isLoading } = useAllClansQuery({ page: 1, limit: 20 });

  const withEmpty = useMemo(() => {
    if (!data) return [];
    return [{ clanId: -1, name: 'All' }].concat(data.data);
  }, [data]);

  return (
    <Select
      size="sm"
      variant="bordered"
      color="primary"
      isLoading={isLoading}
      items={withEmpty}
      classNames={{
        base: 'max-w-xs',
        label: 'text-default-400 text-xs',
        trigger: 'sm:h-[41px] min-h-[41px] h-[41px] border',
        value: 'text-foreground sm:text-xs text-xs',
      }}
      selectedKeys={[value !== -1 ? String(value) : '']}
      onSelectionChange={data => {
        if (!data.currentKey) return;
        onChange(parseInt(data.currentKey));
      }}
      label="Select a Clan"
    >
      {item => <SelectItem key={item.clanId}>{item.name}</SelectItem>}
    </Select>
  );
};
