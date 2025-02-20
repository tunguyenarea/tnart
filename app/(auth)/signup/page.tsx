'use client';

import { AuthForm } from '@/components/custom/auth-form';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { signup, type SignupActionState } from '@/app/(auth)/actions';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [state, formAction] = useActionState<SignupActionState, FormData>(
    signup, { status: 'idle', },
  );

  useEffect(() => {
    if (state.status === 'user_exists') {
      alert('Account already exists');
    } else if (state.status === 'failed') {
      alert('Failed to create account');
    } else if (state.status === 'invalid_data') {
      alert('Failed validating your submission!');
    } else if (state.status === 'success') {
      alert('Account created successfully');
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router]);

  function handleSubmit(formData: FormData) {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
  <>

  <section>
  <AuthForm action={handleSubmit} defaultEmail={email} isSuccessful={isSuccessful} url="/signin" content="Already have an account? Sign in instead.">
      <div className="flex justify-center">
        <h1 className="md:p-6 text-center text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent w-fit">Sign Up</h1>
      </div>
    </AuthForm>
  </section>

  </>
  );
}
