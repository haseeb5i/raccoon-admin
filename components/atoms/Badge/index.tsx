import { cn } from '@/utils/cn';
import { BADGE_VARIANTS } from '@/utils/enums';
import { FC, PropsWithChildren, useMemo } from 'react';

interface BadgeProps {
  variant?: BADGE_VARIANTS;
}

const Badge: FC<PropsWithChildren<BadgeProps>> = ({ children, variant }) => {
  const color = useMemo(() => {
    switch (variant) {
      case BADGE_VARIANTS.NORMAL:
        return { text: 'text-primary-500', bg: 'bg-primary-50' };
      case BADGE_VARIANTS.SUCCESS:
        return { text: 'text-success-500', bg: 'bg-success-50' };
      case BADGE_VARIANTS.DANGER:
        return { text: 'text-danger-500', bg: 'bg-danger-50' };
      case BADGE_VARIANTS.SECONDARY:
        return { text: 'text-secondary-500', bg: 'bg-secondary-50' };
      case BADGE_VARIANTS.WARNING:
        return { text: 'text-warning-400', bg: 'bg-warning-50' };
      case BADGE_VARIANTS.DISABLED:
        return { text: 'text-success-foreground', bg: 'bg-default-100' };
      default:
        return { text: 'text-primary-500', bg: 'bg-primary-50' };
    }
  }, [variant]);

  return (
    <p
      className={cn(
        'w-fit rounded-full px-2 py-[2px] text-sm leading-5',
        color.bg,
        color.text
      )}
    >
      {children}
    </p>
  );
};

export default Badge;
