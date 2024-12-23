'use client';

// Components
import Modal from '@/components/atoms/Modal';

// Redux
import { useUserByIdQuery } from '@/redux/slice/userSlice';
import Image from 'next/image';

const UserView = ({
  open,
  setOpen,
  viewId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewId?: string;
}) => {
  return (
    <Modal title="User Detail" isOpen={open} onClose={() => setOpen(false)}>
      <ModalContent viewId={viewId} />
    </Modal>
  );
};

const ModalContent = ({ viewId }: { viewId?: string }) => {
  const { data, isLoading } = useUserByIdQuery(viewId || 'null');

  if (isLoading) {
    <div className="flex min-h-52 items-center justify-center"> Loading...</div>;
  }

  const hasArrows = data?.items.some(i => i.storeItem.type === 'Arrow');
  const hasBows = data?.items.some(i => i.storeItem.type === 'Bow');
  const hasNoItems = !hasArrows && !hasBows;

  return (
    <div className="-mt-3 mb-5 min-h-52">
      <h3 className="mb-2 font-semibold">User Avatar</h3>
      <div className="mb-4 w-fit">
        <Image
          unoptimized
          src={data?.avatar.imageUrl ?? ''}
          alt={'user avatar'}
          width={100}
          height={100}
        />
        <p className="mt-1 text-center text-sm font-medium">
          Level {data?.avatar.requiredLevel ?? 0}
        </p>
      </div>

      <h3 className="mb-2 font-semibold">Items Purchased</h3>
      {hasNoItems && <p className="my-4 text-sm">No items purchased</p>}
      <ul>
        {hasArrows && (
          <>
            <p className="mb-1 font-medium">Arrows</p>
            <div className="grid grid-cols-3 gap-2">
              {data?.items
                .filter(i => i.storeItem.type === 'Arrow')
                .map(i => (
                  <li key={i.userItemId}>
                    <Image
                      unoptimized
                      src={i.storeItem.imageUrl}
                      alt={i.storeItem.name}
                      width={70}
                      height={70}
                    />
                    <p className="mt-1">
                      {i.storeItem.name} {i.favorite && '(x)'}
                    </p>
                  </li>
                ))}
            </div>
          </>
        )}
        {hasBows && (
          <>
            <p className="mb-1 font-medium">Bows</p>
            <div className="mb-3 grid grid-cols-3 gap-1">
              {data?.items
                .filter(i => i.storeItem.type === 'Bow')
                .map(i => (
                  <li key={i.userItemId}>
                    <Image
                      unoptimized
                      src={i.storeItem.imageUrl}
                      alt={i.storeItem.name}
                      width={70}
                      height={70}
                    />
                    <p className="mt-1">
                      {i.storeItem.name} {i.favorite && '(x)'}
                    </p>
                  </li>
                ))}
            </div>
          </>
        )}
      </ul>
      <h3 className="mb-2 font-semibold">User Referrals</h3>
      <div className="grid grid-cols-3 gap-1 text-sm">
        <div>
          <span>Total Referrals: </span>
          <span className="font-semibold">{data?.totalReferrals ?? 0}</span>
        </div>
        <div>
          <span>Last Week Refs: </span>
          <span className="font-semibold">{data?.lastWeekRefs ?? 0}</span>
        </div>
        <div>
          <span>Last Month Refs: </span>
          <span className="font-semibold">{data?.lastWeekRefs ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default UserView;
