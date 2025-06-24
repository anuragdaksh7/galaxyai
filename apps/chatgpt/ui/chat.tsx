'use client';

import { Message, useChat } from '@ai-sdk/react';
import { createIdGenerator } from 'ai';

export default function Chat({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    id, // use the provided chat ID
    initialMessages, // initial messages if provided
    sendExtraMessageFields: true, // send id and createdAt for each message
    generateId: createIdGenerator({
      prefix: 'msgc',
      size: 16,
    }),
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
  });

  // simplified rendering code, extend as needed:
  return (
    <div className='flex-{1_0_0]'>
      <div className='flex flex-col gap-2 overflow-y-auto h-full'>
        {messages.map(m => (
          <div key={m.id}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>

      <p>ChatGPT can make mistakes. Check important info. See Cookie Preferences.</p>
    </div>
  );
}