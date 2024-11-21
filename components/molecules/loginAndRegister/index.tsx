'use client';

import React, { useState } from 'react';

// Components
import LoginForm from '@/components/organisms/loginForm';
import RegisterForm from '@/components/organisms/RegisterForm';

const LoginRegister = () => {
  const [active, setActive] = useState<number>(1);

  return (
    <div>
      {active === 1 ? (
        <LoginForm setActive={setActive} />
      ) : (
        <RegisterForm setActive={setActive} />
      )}
    </div>
  );
};

export default LoginRegister;
