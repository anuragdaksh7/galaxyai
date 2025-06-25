import { loadChat } from '@/tools/chat-store';
import Chat from '@/ui/chat';
import { auth } from '@clerk/nextjs/server';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await loadChat(id, userId); // load the chat messages
  return <Chat id={id} initialMessages={messages} />; // display the chat
}