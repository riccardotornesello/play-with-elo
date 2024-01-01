import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignOutPage() {
  await async function signOut() {
    'use server';

    cookies().delete('name');
  };

  redirect('/');
}
