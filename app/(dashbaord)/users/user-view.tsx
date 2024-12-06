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
  const { data, isLoading } = useUserByIdQuery(viewId || 'null');

  return (
    <Modal title="User Detail" isOpen={open} onClose={() => setOpen(false)}>
      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center"> Loading...</div>
      ) : (
        <div className="-mt-2 mb-5 min-h-52">
          {data?.items ? (
            <>
              <h3 className="mb-2 font-semibold">Items Purchased</h3>
              <ul>
                {data.items.map((i, idx) => (
                  <li className="flex items-center gap-4" key={i.userItemId}>
                    <span>{idx + 1} </span>
                    <Image
                      unoptimized
                      src={i.storeItem.imageUrl}
                      alt={i.storeItem.name}
                      width={50}
                      height={50}
                    />
                    <span> {i.storeItem.name}</span>
                    <span>Level {i.level}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-5 text-center text-lg">No Items purchased</div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default UserView;
