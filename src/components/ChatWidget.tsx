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
  repliedTo?: string; // ID сообщения, на которое отвечают
}

interface AdminReply {
  targetMessageId: string;
  targetMessageText: string;
  replyText: string;
}

const ChatWidget = () => {
  const { isChatOpen, setIsChatOpen } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
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
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminReply, setAdminReply] = useState<AdminReply | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // Функция для начала ответа на сообщение
  const startAdminReply = (messageId: string, messageText: string) => {
    setAdminReply({
      targetMessageId: messageId,
      targetMessageText: messageText,
      replyText: ''
    });
    setIsAdminMode(true);
  };

  // Функция для отправки ответа администратора
  const sendAdminReply = () => {
    if (!adminReply || !adminReply.replyText.trim()) return;

    const adminMessage: Message = {
      id: Date.now().toString(),
      text: adminReply.replyText,
      sender: 'admin',
      timestamp: new Date(),
      read: true,
      repliedTo: adminReply.targetMessageId,
    };

    setMessages(prev => [...prev, adminMessage]);
    setAdminReply(null);
    setIsAdminMode(false);
  };

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

    // Автоматический ответ только если не в режиме администратора
    if (!isAdminMode) {
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
    }
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
      if (isAdminMode && adminReply) {
        sendAdminReply();
      } else {
        handleSendMessage();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
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
    setAdminReply(null);
    setIsAdminMode(false);
  };

  const cancelAdminReply = () => {
    setAdminReply(null);
    setIsAdminMode(false);
  };

  // Функция для получения текста сообщения по ID
  const getMessageText = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    return message ? message.text : '';
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
              {isAdminMode ? 'Admin Rejimi - Javob Berish' : 'Yordam Markazi'}
            </span>
          </div>
          <div className="chat-widget-controls">
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`chat-control-btn ${isAdminMode ? 'admin-active' : ''}`}
              title={isAdminMode ? "Admin rejimidan chiqish" : "Admin rejimi"}
            >
              {isAdminMode ? "👑" : "👤"}
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
            {/* Панель ответа администратора */}
            {isAdminMode && adminReply && (
              <div className="admin-reply-panel">
                <div className="admin-reply-header">
                  <span>Javob berilayotgan xabar:</span>
                  <button onClick={cancelAdminReply} className="cancel-reply-btn">✖</button>
                </div>
                <div className="admin-reply-target">
                  {adminReply.targetMessageText}
                </div>
                <div className="admin-reply-input">
                  <input
                    type="text"
                    value={adminReply.replyText}
                    onChange={(e) => setAdminReply(prev => 
                      prev ? {...prev, replyText: e.target.value} : null
                    )}
                    onKeyPress={handleKeyPress}
                    placeholder="Admin javobini yozing..."
                    className="message-input"
                    autoFocus
                  />
                  <button 
                    onClick={sendAdminReply} 
                    disabled={!adminReply.replyText.trim()}
                    className="send-button admin-send"
                    title="Javobni yuborish"
                  >
                    👑
                  </button>
                </div>
              </div>
            )}

            <div className="quick-questions">
              <button 
                onClick={() => sendQuickQuestion("Uy vazifalari qanday?")}
                className="quick-question-btn"
                disabled={isAdminMode}
              >
                📚 Vazifalar
              </button>
              <button 
                onClick={() => sendQuickQuestion("Baholarim qanday?")}
                className="quick-question-btn"
                disabled={isAdminMode}
              >
                📊 Baholar
              </button>
              <button 
                onClick={() => sendQuickQuestion("Ertangi dars jadvali")}
                className="quick-question-btn"
                disabled={isAdminMode}
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
                    {/* Показать на какое сообщение отвечают */}
                    {message.repliedTo && (
                      <div className="reply-context">
                        <em>Javob: {getMessageText(message.repliedTo)}</em>
                      </div>
                    )}
                    <div className="message-bubble">
                      {message.text.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                    <div className="message-time">
                      {formatTime(message.timestamp)}
                      {isAdminMode && message.sender === 'user' && (
                        <button 
                          onClick={() => startAdminReply(message.id, message.text)}
                          className="reply-btn"
                          title="Javob berish"
                        >
                          ↩️
                        </button>
                      )}
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

            {/* Обычный ввод сообщения (только не в режиме админа) */}
            {!isAdminMode && (
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
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ChatWidget;