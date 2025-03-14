import apiService from "../config/api-service";

// Types
export interface Message {
  id: number;
  chat_id: number;
  content: string;
  message_type: "human" | "aicoach";
}

export interface Chat {
  id: number;
  chat_name: string;
  avatar: string;
}

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch all chats
export const fetchChats = async (): Promise<Chat[]> => {
  const chats: Chat[] = await apiService.post("user/chats", {}, true);
  return chats;
};

export const createChat = async (name: string): Promise<Chat> => {
  const chat: Chat = await apiService.post(
    "chat/create",
    { chat_name: name },
    true
  );
  return chat;
};

export const fetchMessagesByChatId = async (
  chatId: number
): Promise<Message[]> => {
  const messages: Message[] = await apiService.get(
    `chat/${chatId}/messages`,
    true
  );
  return messages;
};

export const createMessage = async (
  chatId: number,
  message: string
): Promise<Message> => {
  const newMessage: Message = await apiService.post(
    `message/create`,
    {
      chat_id: chatId,
      content: message,
      message_type: "aicoach",
    },
    true
  );
  return newMessage;
};

export const sendMessage = async (
  chatId: number,
  message: string
): Promise<Message> => {
  const newMessage: Message = await apiService.post(
    `/llm`,
    {
      chat_id: chatId,
      content: message,
      message_type: "human",
    },
    true
  );
  return newMessage;
};

export const startChat = async (chatId: number): Promise<any> => {
  const response: any = await apiService.post(
    `start/chat?chat_id=${chatId}`,
    {},
    true
  );
  return response;
};
