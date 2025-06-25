'use client';

import { useEffect } from 'react';

import { useScrollToBottom } from '@/components/use-scroll-to-bottom';
import { Message, useChat } from '@ai-sdk/react';
import { createIdGenerator } from 'ai';

export default function Chat({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    id,
    initialMessages,
    sendExtraMessageFields: true,
    generateId: createIdGenerator({
      prefix: 'msgc',
      size: 16,
    }),
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
  });

  const [messagesContainerRef, messagesEndRef, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, messages[messages.length - 1]?.content]);

  // simplified rendering code, extend as needed:
  return (
    <div className='flex flex-col gap-4 h-full w-full items-center relative'>
      <div ref={messagesContainerRef} className='flex flex-col gap-2 overflow-y-auto flex-[1_0_0] w-full items-center pb-[200px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex max-w-[48rem] w-[48rem] py-5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <pre className={`flex font-sans gap-2 max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? 'px-5 py-2.5 bg-[#323232D9] rounded-[20px]' : ''}`}>
              {msg.content}
            </pre>
          </div>
        ))}
        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <div className='absolute bottom-0 bg-[#212121] rounded-t-[28px] w-[48rem] '>
        <form onSubmit={handleSubmit} className=' p-2.5 bg-[#303030] rounded-[20px] flex flex-col'>
          <input value={input} placeholder='Ask anything' className=' min-h-12 border-0 outline-0 px-3' onChange={handleInputChange} />
          <div className=' h-[36px]'></div>
        </form>

        <p className='text-xs text-center p-2'>ChatGPT can make mistakes. Check important info. See Cookie Preferences.</p>
      </div>
    </div>
  );
}