import React, { ReactNode } from 'react';

// Next UI
import {
  Modal as NextModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

// Components
import CustomButton from '../Button';

interface PopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  primaryButtonLoading?: boolean;
  submitButtonColor?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  children: ReactNode;
}

const Modal: React.FC<PopUpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  primaryButtonLabel,
  secondaryButtonLabel,
  primaryButtonLoading,
  submitButtonColor,
  children,
}) => {
  return (
    <NextModal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      scrollBehavior={'inside'}
      classNames={{
        closeButton: 'mt-[6px]',
      }}
      motionProps={{
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.3 },
        transition: { duration: 0.1, ease: 'easeOut' },
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title || 'Model'}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter className="flex items-center justify-between">
              <CustomButton
                variant="light"
                className="border-y-1 border-grayColor5 bg-grayColor5 text-foreground"
                onClick={onClose}
              >
                {secondaryButtonLabel || 'Close'}
              </CustomButton>
              <CustomButton
                onClick={onSubmit}
                color={submitButtonColor}
                isLoading={primaryButtonLoading}
              >
                {primaryButtonLabel || 'Confirm'}
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextModal>
  );
};

export default Modal;
