'use client';

import { forwardRef, useState } from 'react';
import { MdFileUpload } from 'react-icons/md';
import { ControllerRenderProps } from 'react-hook-form';
import { Spinner, useButton } from '@nextui-org/react';
import { SHADOWNET_TOKEN } from '@/utils/constant';
import { getCookie } from '@/utils/cookie';
import { cn } from '@/utils/cn';

type ImageUploadProps = ControllerRenderProps & {
  classes?: {
    preview?: string;
  };
  onError: (message: string) => void;
};

const FileUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ classes, onChange, onError, value: imageUrl }, ref) => {
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const { getButtonProps, styles } = useButton({ color: 'primary', variant: 'solid' });

    const onChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setIsUploadLoading(true);

        const target = event.target;
        const file: File = (target.files as FileList)[0];

        const formData = new FormData();
        formData.append('file', file);

        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload/file`, {
          headers: {
            'x-admin-api-key': getCookie(SHADOWNET_TOKEN) || '',
          },
          method: 'POST',
          body: formData,
        });

        if (resp.ok) {
          const data = await resp.json();
          onChange(data.fileUrl);
        }

        setIsUploadLoading(false);
      } catch (error) {
        console.error(error);
        onError('Upload failed. Please try again.');
        setIsUploadLoading(false);
      }
    };

    return (
      <div ref={ref} className="wrap flex items-center gap-4">
        {imageUrl && (
          <img
            className={cn('max-h-[150px] max-w-[150px]', classes?.preview)}
            src={imageUrl}
            alt="Post image"
          />
        )}
        <label htmlFor="image-input">
          <input
            id="image-input"
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={onChangeHandler}
          />
          <input id="file" type="hidden" />
          <br />
          <span className={styles} {...getButtonProps()}>
            Upload
            {isUploadLoading ? <Spinner color="current" size="sm" /> : <MdFileUpload />}
          </span>
        </label>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
