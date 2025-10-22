import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useChat } from "@/contexts/ChatContext";
import "@/styles/ChatWidget.css"

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'admin';
  timestamp: Date;
  read: boolean;
  userId?: string;
  repliedTo?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  lastActivity: Date;
  unreadCount: number;
  hasUnreplied: boolean;
}

const ChatWidget = () => {
  const { isChatOpen, setIsChatOpen } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  
  // Состояния для пользовательского чата
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Salom! Yordam kerakmi? Men sizga darslar, baholar va uy vazifalari haqida maʼlumot bera olaman.',
      sender: 'support',
      timestamp: new Date(),
      read: true,
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Состояния для админ-панели
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      name: 'Ali Valiyev',
      avatar: 'A',
      lastActivity: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      hasUnreplied: true
    },
    {
      id: 'user2',
      name: 'Dilshod Rajabov',
      avatar: 'D',
      lastActivity: new Date(Date.now() - 30 * 60000),
      unreadCount: 0,
      hasUnreplied: false
    },
    {
      id: 'user3',
      name: 'Madina Qodirova',
      avatar: 'M',
      lastActivity: new Date(Date.now() - 120 * 60000),
      unreadCount: 1,
      hasUnreplied: true
    }
  ]);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>('user1');
  const [adminReplyText, setAdminReplyText] = useState('');
  
  // Все сообщения всех пользователей
  const [allUserMessages, setAllUserMessages] = useState<{ [key: string]: Message[] }>({
    user1: [
      {
        id: '1',
        text: 'Assalomu alaykum! Matematika uy vazifasi haqida savolim bor',
        sender: 'user',
        timestamp: new Date(Date.now() - 10 * 60000),
        read: true,
        userId: 'user1'
      },
      {
        id: '2',
        text: 'Qanday masalalar qiyin bo\'lyapti?',
        sender: 'admin',
        timestamp: new Date(Date.now() - 8 * 60000),
        read: true,
        userId: 'user1'
      },
      {
        id: '3',
        text: 'Algebraik ifodalarni soddalashtirish masalalari',
        sender: 'user',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: true,
        userId: 'user1'
      }
    ],
    user2: [
      {
        id: '1',
        text: 'Baholarim qanday?',
        sender: 'user',
        timestamp: new Date(Date.now() - 35 * 60000),
        read: true,
        userId: 'user2'
      },
      {
        id: '2',
        text: 'Hozirgi o\'rtacha bahoingiz: 4.7',
        sender: 'admin',
        timestamp: new Date(Date.now() - 30 * 60000),
        read: true,
        userId: 'user2'
      }
    ],
    user3: [
      {
        id: '1',
        text: 'Ertangi dars jadvali qanday?',
        sender: 'user',
        timestamp: new Date(Date.now() - 125 * 60000),
        read: true,
        userId: 'user3'
      }
    ]
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const adminMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollAdminToBottom = () => {
    adminMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (selectedUserId && allUserMessages[selectedUserId]) {
      setTimeout(() => {
        scrollAdminToBottom();
      }, 100);
    }
  }, [selectedUserId, allUserMessages]);

  // Функции для пользовательского чата
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      read: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    setIsTyping(true);
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getSupportResponse(newMessage),
        sender: 'support',
        timestamp: new Date(),
        read: false,
      };
      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getSupportResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('vazifa') || lowerMessage.includes('uy vazifasi')) {
      return "Hozirda sizda 3 ta faol uy vazifasi bor:\n• Matematika - Algebraik ifodalar (20.01)\n• Fizika - Mexanika (22.01)\n• Ona tili - Insho (25.01)";
    }
    
    if (lowerMessage.includes('baho') || lowerMessage.includes('ball')) {
      return "Hozirgi o'rtacha bahoingiz: 4.5\nEng yaxshi baholar: Matematika (5.0), Fizika (4.8)";
    }
    
    if (lowerMessage.includes('dars') || lowerMessage.includes('jadval')) {
      return "Ertangi dars jadvali:\n1. Matematika (08:00-09:30)\n2. Fizika (09:45-11:15)\n3. Tarix (11:30-13:00)";
    }
    
    if (lowerMessage.includes('davomat') || lowerMessage.includes('kel')) {
      return "Joriy oy davomida:\n• Umumiy davomat: 92%\n• Sababli yo'qlik: 2 kun";
    }
    
    if (lowerMessage.includes('yordam') || lowerMessage.includes('help')) {
      return "Men quyidagi sohalarda yordam bera olaman:\n📚 Uy vazifalari\n📊 Baholar\n📅 Dars jadvali\n✅ Davomat";
    }
    
    if (lowerMessage.includes('rahmat') || lowerMessage.includes('thanks')) {
      return "Rahmat! Yana savollaringiz bo'lsa, murojaat qiling. 😊";
    }
    
    if (lowerMessage.includes('salom') || lowerMessage.includes('hello')) {
      return "Salom! O'quv platformasida yordam kerakmi?";
    }
    
    return "Kechirasiz, tushunmadim. Quyidagi mavzularda yordam bera olaman:\n• Uy vazifalari\n• Baholar\n• Dars jadvali\n• Davomat";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'user') {
        handleSendMessage();
      } else if (activeTab === 'admin' && selectedUserId) {
        handleAdminSend();
      }
    }
  };

  // Функции для админ-панели
  const handleAdminSend = () => {
    if (!adminReplyText.trim() || !selectedUserId) return;

    const adminMessage: Message = {
      id: Date.now().toString(),
      text: adminReplyText,
      sender: 'admin',
      timestamp: new Date(),
      read: true,
      userId: selectedUserId,
    };

    // Добавляем сообщение администратора в чат выбранного пользователя
    setAllUserMessages(prev => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), adminMessage]
    }));

    // Обновляем статистику пользователя
    setUsers(prev => prev.map(user => 
      user.id === selectedUserId 
        ? { 
            ...user, 
            hasUnreplied: false, 
            unreadCount: 0,
            lastActivity: new Date()
          }
        : user
    ));

    setAdminReplyText('');
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    // Сбрасываем счетчик непрочитанных при выборе пользователя
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, unreadCount: 0, hasUnreplied: false }
        : user
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const sendQuickQuestion = (question: string) => {
    setNewMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Suhbat yangilandi. Yordam kerakmi?',
        sender: 'support',
        timestamp: new Date(),
        read: true,
      }
    ]);
  };

  const getUnrepliedCount = () => {
    return users.filter(user => user.hasUnreplied).length;
  };

  const getSelectedUser = () => {
    return users.find(user => user.id === selectedUserId);
  };

  const getSelectedUserMessages = () => {
    return selectedUserId ? allUserMessages[selectedUserId] || [] : [];
  };

  // Функция для получения последнего сообщения пользователя
  const getLastMessage = (userId: string) => {
    const userMessages = allUserMessages[userId];
    if (!userMessages || userMessages.length === 0) return 'Xabarlar yo\'q';
    
    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage.text.length > 30 
      ? lastMessage.text.substring(0, 30) + '...' 
      : lastMessage.text;
  };

  if (!isChatOpen) {
    return null;
  }

  return createPortal(
    <div className="chat-widget-portal">
      <div className="chat-widget-container">
        <div className="chat-widget-header">
          <div className="chat-widget-title">
            <div className="chat-bot-icon">🤖</div>
            <span>
              {activeTab === 'admin' ? 'Admin Panel' : 'Yordam Markazi'}
            </span>
          </div>
          <div className="chat-widget-controls">
            <button 
              onClick={() => setActiveTab(activeTab === 'user' ? 'admin' : 'user')}
              className={`chat-control-btn ${activeTab === 'admin' ? 'admin-active' : ''}`}
              title={activeTab === 'admin' ? "Foydalanuvchi rejimi" : "Admin rejimi"}
            >
              {activeTab === 'admin' ? "👤" : "👑"}
            </button>
            <button 
              onClick={clearChat}
              className="chat-control-btn"
              title="Suhbatni tozalash"
            >
              🗑️
            </button>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="chat-control-btn"
              title={isMinimized ? "Kengaytirish" : "Qisqartirish"}
            >
              {isMinimized ? "📂" : "📁"}
            </button>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="chat-control-btn"
              title="Yopish"
            >
              ❌
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {activeTab === 'user' ? (
              // Пользовательский интерфейс чата
              <>
                <div className="quick-questions">
                  <button 
                    onClick={() => sendQuickQuestion("Uy vazifalari qanday?")}
                    className="quick-question-btn"
                  >
                    📚 Vazifalar
                  </button>
                  <button 
                    onClick={() => sendQuickQuestion("Baholarim qanday?")}
                    className="quick-question-btn"
                  >
                    📊 Baholar
                  </button>
                  <button 
                    onClick={() => sendQuickQuestion("Ertangi dars jadvali")}
                    className="quick-question-btn"
                  >
                    📅 Jadval
                  </button>
                </div>

                <div className="chat-widget-messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender === 'user' ? 'message-user' : 
                        message.sender === 'admin' ? 'message-admin' : 'message-support'}`}
                    >
                      <div className="message-avatar">
                        {message.sender === 'user' ? '👤' : 
                         message.sender === 'admin' ? '👑' : '🤖'}
                      </div>
                      <div className="message-content">
                        <div className="message-bubble">
                          {message.text.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                        <div className="message-time">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="message message-support">
                      <div className="message-avatar">
                        🤖
                      </div>
                      <div className="message-content">
                        <div className="message-bubble typing-indicator">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-widget-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Xabar yozing yoki tez savollardan foydalaning..."
                    className="message-input"
                  />
                  <button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="send-button"
                    title="Yuborish"
                  >
                    📤
                  </button>
                </div>
              </>
            ) : (
              // Админ-панель
              <div className="admin-chat-panel">
                <div className="admin-chat-header">
                  <h2>Admin Chat Panel</h2>
                  <div className="admin-stats">
                    <span>Faol foydalanuvchilar: {users.length}</span>
                    <span className="unreplied-count">
                      Javobsiz xabarlar: {getUnrepliedCount()}
                    </span>
                  </div>
                </div>

                <div className="admin-chat-layout">
                  {/* Список пользователей */}
                  <div className="users-list">
                    <h3>Foydalanuvchilar</h3>
                    {users.length > 0 ? (
                      users.map(user => (
                        <div
                          key={user.id}
                          className={`user-item ${selectedUserId === user.id ? 'selected' : ''} ${
                            user.hasUnreplied ? 'unreplied' : ''
                          }`}
                          onClick={() => handleUserSelect(user.id)}
                        >
                          <div className="user-avatar">
                            {user.avatar}
                          </div>
                          <div className="user-info">
                            <div className="user-name">
                              {user.name}
                              {user.unreadCount > 0 && (
                                <span className="new-badge">{user.unreadCount}</span>
                              )}
                            </div>
                            <div className="last-message">
                              {getLastMessage(user.id)}
                            </div>
                            <div className="message-time">
                              {formatTime(user.lastActivity)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-users">Foydalanuvchilar topilmadi</div>
                    )}
                  </div>

                  {/* Область чата */}
                  <div className="admin-chat-area">
                    {selectedUserId ? (
                      <>
                        <div className="chat-messages">
                          {getSelectedUserMessages().map((message) => (
                            <div
                              key={message.id}
                              className={`admin-message ${
                                message.sender === 'user' ? 'user-message' : 'admin-message'
                              }`}
                            >
                              <div className="message-header">
                                <span className="sender-name">
                                  {message.sender === 'user' ? getSelectedUser()?.name : 'Admin'}
                                  {message.sender === 'admin' && <span className="admin-badge">ADMIN</span>}
                                </span>
                                <span className="message-time">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <div className="message-text">
                                {message.text}
                              </div>
                            </div>
                          ))}
                          <div ref={adminMessagesEndRef} />
                        </div>

                        <div className="admin-reply-area">
                          <textarea
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Javob yozing..."
                            className="admin-reply-input"
                            rows={3}
                          />
                          <button
                            onClick={handleAdminSend}
                            disabled={!adminReplyText.trim()}
                            className="admin-reply-btn"
                          >
                            Javob yuborish
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="no-selection">
                        Chatni ko'rish uchun foydalanuvchi tanlang
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ChatWidget;