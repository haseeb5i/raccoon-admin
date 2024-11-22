import { Card, Divider, Skeleton } from '@nextui-org/react';
import { FC, Fragment } from 'react';
import { SKELETON_VARIANT } from '@/utils/enums';

interface CustomSkeletonProps {
  variant?: SKELETON_VARIANT;
}

const CustomSkeleton: FC<CustomSkeletonProps> = ({ variant }) => {
  if (variant === SKELETON_VARIANT.TABLE) {
    return (
      <Card className="w-full space-y-5 p-4" radius="lg">
        <div className="mt-2 flex justify-between gap-12">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={`TableSkeleton1: ${index}`} className="w-1/5 rounded-lg">
                <div className="h-6 rounded-lg bg-default-300"></div>
              </Skeleton>
            ))}
        </div>
        <div className="space-y-3">
          <Divider className="my-1 h-[2px]" />
          {Array(4)
            .fill(0)
            .map((_, ind) => (
              <Fragment key={`TableSkeleton2: ${ind}`}>
                <div
                  key={`TableSkeleton2: ${ind}`}
                  className="flex justify-between gap-12 py-2"
                >
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        key={`TableSkeleton3: ${index}`}
                        className="w-1/5 rounded-lg"
                      >
                        <div className="h-3 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    ))}
                </div>
                <Divider className="h-[2px]" />
              </Fragment>
            ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={`TableSkeleton4: ${index}`} className="rounded-lg">
                <div className="h-10 w-10 rounded-full bg-default-300"></div>
              </Skeleton>
            ))}
          <Skeleton className="rounded-lg">
            <div className="h-10 w-24 rounded-full bg-default-300"></div>
          </Skeleton>
        </div>
      </Card>
    );
  } else if (variant === SKELETON_VARIANT.CARD) {
    return (
      <Card className="w-full space-y-5 p-4" radius="lg">
        <Skeleton className="w-1/3 rounded-lg">
          <div className="h-12 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      </Card>
    );
  } else if (variant === SKELETON_VARIANT.SMALLLEADINGIMAGECARD) {
    return (
      <Card className="flex w-full flex-row items-center gap-4 p-4" radius="lg">
        <Skeleton className="h-14 w-14 rounded-lg">
          <div className="h-full w-full rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="mt-0 flex flex-col gap-4">
          <Skeleton className="w-12 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-24 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
      </Card>
    );
  } else {
    // For text variant
    return (
      <div className="my-2">
        <Skeleton className="mb-2 w-44 rounded-lg">
          <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
        <Skeleton className="w-56 rounded-lg">
          <div className="h-3 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    );
  }
};

export default CustomSkeleton;
