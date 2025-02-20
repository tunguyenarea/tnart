'use server';

import { z } from 'zod';
import { signIn } from '@/app/(auth)/auth';
import { createUser, getUser } from '@/app/lib/data';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export interface SigninActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const signin = async (
  _: SigninActionState,
  formData: FormData,
): Promise<SigninActionState> => {
  try {
    const validatedFields = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedFields.email,
      password: validatedFields.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if(error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface SignupActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'user_exists' | 'invalid_data';
}

export const signup = async (
  _: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> => {
  try {
    const validatedFields = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedFields.email);

    if (user) {
      return { status: 'user_exists' } as SignupActionState;
    }
    await createUser(validatedFields.email, validatedFields.password);
    await signIn('credentials', {
      email: validatedFields.email,
      password: validatedFields.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
