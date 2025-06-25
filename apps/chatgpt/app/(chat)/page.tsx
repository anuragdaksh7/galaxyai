import { redirect } from 'next/navigation';
import { createChat } from '@/tools/chat-store';
import { auth } from '@clerk/nextjs/server'


export default async function Page() {
  const { userId } = await auth()
  const id = await createChat({ userId: userId || undefined }); // create a new chat
  redirect(`/${id}`); // redirect to chat page, see below
}