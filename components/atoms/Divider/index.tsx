import { cn } from '@/utils/cn';

export interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Divider: React.FC<DividerProps> = ({
  className,
  orientation = 'horizontal',
}: DividerProps) => {
  return (
    <div
      className={cn(
        'w-full bg-default-100',
        orientation === 'horizontal' ? 'h-[1px]' : 'w-[1px]',
        className
      )}
    ></div>
  );
};

export default Divider;
