'use client';

// Components
import Modal from '@/components/atoms/Modal';

// Redux
import { useUserByIdQuery } from '@/redux/slice/userSlice';

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
  console.log(data);

  return (
    <Modal title="User Detail" isOpen={open} onClose={() => setOpen(false)}>
      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center"> Loading...</div>
      ) : (
        <div className="mb-5">
          <h3>Items Purchased</h3>
          <ul>{}</ul>
        </div>
      )}
    </Modal>
  );
};

export default UserView;
