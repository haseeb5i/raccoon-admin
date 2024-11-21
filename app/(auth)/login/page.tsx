// Component
import LoginRegister from '@/components/molecules/loginAndRegister';

const page = () => {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center overflow-hidden rounded-md bg-background px-3">
      <div className="flex min-h-[500px] w-[900px] overflow-hidden rounded-md border border-lightGray bg-white shadow-xl">
        <div className="flex flex-1 justify-center rounded-md bg-gradient-to-tr from-[#4046a3] via-[#5156be] to-[#6b70d6] p-12"></div>
        <div className="flex-1 bg-white p-12">
          <LoginRegister />
        </div>
      </div>
    </div>
  );
};

export default page;
