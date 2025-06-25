import { google } from "@ai-sdk/google";
import { appendClientMessage, appendResponseMessages, createIdGenerator, streamText } from 'ai';
import { loadChat, saveChat } from '@/tools/chat-store';
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
const { userId } = await auth()

  const { message, id } = await req.json();

  const previousMessages = await loadChat(id, userId);

  const messages = appendClientMessage({
    messages: previousMessages,
    message,
  });

  const result = streamText({
    model: google('gemini-1.5-flash-002'),
    messages,
    system: 'You are a helpful assistant.',
    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
    experimental_generateMessageId: createIdGenerator({
      prefix: 'msgs',
      size: 16,
    }),
  });

  return result.toDataStreamResponse();
}