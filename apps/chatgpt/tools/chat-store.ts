import { generateId, Message } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from "@repo/db"
import type { Chat, MessageRole } from "@repo/db/client"

function convertToDbMessage(aiMessage: Message): any {
  return {
    mid: aiMessage.id,
    content: aiMessage.content,
    role: aiMessage.role as MessageRole,
    timestamp: new Date(aiMessage.createdAt ?? Date.now()),
  };
}

function convertFromDbMessage(dbMessage: any): Message {
  return {
    id: dbMessage.mid,
    role: dbMessage.role,
    content: dbMessage.content,
    createdAt: dbMessage.timestamp,
  };
}


export async function getChats(userId: string): Promise<Chat[]> {
  const chats = await prisma.chat.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  return chats
}

export async function loadChat(id: string, userId: string | null): Promise<Message[]> {
  const chat = await prisma.chat.findUnique({
    where: { cid: id },
    include: { messages: { orderBy: { timestamp: 'asc' } } },
  });

  if (!chat) throw new Error('Chat not found');
  return chat.messages.map(convertFromDbMessage);

  // return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}

export async function createChat({ userId }: { userId?: string }): Promise<string> {
  const id = generateId();
  await prisma.chat.create({
    data: {
      cid: id,
      name: `Chat ${id}`,
      userId: userId || null
    },
  });
  return id;
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
  userId?: string
}): Promise<void> {
  const chat = await prisma.chat.findUnique({ where: { cid: id } });
  await prisma.$transaction([
    prisma.message.deleteMany({ where: { chatId: chat?.id } }),
    ...messages.map((msg) =>
      prisma.message.create({
        data: {
          ...convertToDbMessage(msg),
          chatId: chat?.id,
        },
      })
    ),
  ]);
  // const content = JSON.stringify(messages, null, 2);
  // await writeFile(getChatFile(id), content);
}
// import fs from 'fs/promises';

// export async function migrateChatsFromJson() {
//   const chatDir = path.join(process.cwd(), '.chats');
//   const files = await fs.readdir(chatDir);

//   for (const file of files) {
//     const id = file.replace('.json', '');
//     const content = await fs.readFile(path.join(chatDir, file), 'utf8');
//     const messages: Message[] = JSON.parse(content);

//     // Create chat (or skip if exists)
//     const chat = await prisma.chat.upsert({
//       where: { id },
//       create: {
//         id,
//         cid: id,
//         name: `Imported ${id}`,
//       },
//       update: {}, // No update logic
//     });

//     // Prepare DB-friendly messages
//     const dbMessages = messages.map((m) => ({
//       ...convertToDbMessage(m),
//       chatId: chat.id,
//     }));

//     // Insert messages in batch
//     await prisma.message.createMany({
//       data: dbMessages,
//     });
//   }

//   console.log('✅ All chats migrated successfully.');
// }