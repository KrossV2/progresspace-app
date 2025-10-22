import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'admin';
  timestamp: Date;
  read: boolean;
  userId?: string;
  userName?: string;
}

interface ChatContextType {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  unreadCount: number;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  allMessages: Message[];
  addMessage: (message: Message) => void;
  adminReply: (messageId: string, replyText: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const addMessage = (message: Message) => {
    setAllMessages(prev => [...prev, message]);
  };

  const adminReply = (messageId: string, replyText: string) => {
    const replyMessage: Message = {
      id: Date.now().toString(),
      text: replyText,
      sender: 'admin',
      timestamp: new Date(),
      read: false,
    };
    setAllMessages(prev => [...prev, replyMessage]);
  };

  return (
    <ChatContext.Provider value={{ 
      isChatOpen, 
      setIsChatOpen, 
      unreadCount,
      incrementUnreadCount,
      resetUnreadCount,
      allMessages,
      addMessage,
      adminReply
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};