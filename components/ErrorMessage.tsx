import Text from './atoms/commonText';

export const ErrorMessage = ({ errorMsg }: { errorMsg?: string }) => {
  if (!errorMsg) return null;
  return (
    <Text
      containerTag="h6"
      className="ml-2 mt-1 text-[10px] font-semibold text-danger-500 sm:text-xs"
    >
      {errorMsg}
    </Text>
  );
};
