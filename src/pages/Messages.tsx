import { useState } from "react";
import { MessageCircle, Send, Search, Filter, Plus, User, Clock, Phone, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with API call to fetch messages data
  const chats = [
    {
      id: 1,
      name: "Karimova Nilufar",
      role: "Matematika o'qituvchisi",
      lastMessage: "Ertangi dars bekor qilindi, eslatma jo'natdim",
      timestamp: "10:30",
      unreadCount: 2,
      isOnline: true,
      avatar: "KN"
    },
    {
      id: 2,
      name: "10-A sinf guruhi",
      role: "Sinf guruhi",
      lastMessage: "Ertaga sport musobaqasi bor, qatnashing!",
      timestamp: "09:15",
      unreadCount: 5,
      isOnline: false,
      avatar: "10A"
    },
    {
      id: 3,
      name: "Smith John",
      role: "Ingliz tili o'qituvchisi",
      lastMessage: "Homework submitted successfully! Well done.",
      timestamp: "Kecha",
      unreadCount: 0,
      isOnline: true,
      avatar: "SJ"
    },
    {
      id: 4,
      name: "Ota-onalar guruhi",
      role: "Ota-onalar",
      lastMessage: "Yig'ilish 15-yanvar kuni bo'ladi",
      timestamp: "2 kun oldin",
      unreadCount: 1,
      isOnline: false,
      avatar: "OG"
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Karimova Nilufar",
      content: "Salom Aziz! Ertangi matematika darsi bekor qilindi.",
      timestamp: "10:25",
      isMe: false
    },
    {
      id: 2,
      senderId: "me",
      senderName: "Men",
      content: "Salom! Tushundim, rahmat xabar bergani uchun.",
      timestamp: "10:27",
      isMe: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Karimova Nilufar",
      content: "Ertangi dars bekor qilindi, eslatma jo'natdim. Keyingi dars rejasini ertaga aytaman.",
      timestamp: "10:30",
      isMe: false
    }
  ];

  const selectedChatInfo = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement message sending via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Xabarlar</h1>
          <p className="text-muted-foreground">O'qituvchilar va sinf a'zolari bilan muloqot qiling</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Yangi chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="shadow-card border-border lg:col-span-1">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <ScrollArea className="h-[500px]">
            <div className="p-2 space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedChat === chat.id 
                      ? "bg-primary/10 border-primary/20 border" 
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                        <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-1">{chat.role}</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1 mr-2">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className="shadow-card border-border lg:col-span-2">
          {selectedChatInfo ? (
            <>
              {/* Chat Header */}
              <CardHeader className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {selectedChatInfo.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedChatInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChatInfo.isOnline ? "Onlayn" : "Oxirgi faollik: 2 soat oldin"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-3">
                  <Textarea
                    placeholder="Xabar yozing..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="bg-gradient-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-3">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg">Chatni tanlang</h3>
                  <p className="text-muted-foreground">Xabar almashishni boshlash uchun chatni tanlang</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card border-border p-4 text-center hover:shadow-elevated transition-all cursor-pointer">
          <User className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold mb-1">O'qituvchilar</h3>
          <p className="text-sm text-muted-foreground">Barcha fanlar o'qituvchilari bilan aloqa</p>
        </Card>
        
        <Card className="shadow-card border-border p-4 text-center hover:shadow-elevated transition-all cursor-pointer">
          <MessageCircle className="h-8 w-8 text-success mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Sinf guruhi</h3>
          <p className="text-sm text-muted-foreground">Sinfdoshlar bilan umumiy chat</p>
        </Card>
        
        <Card className="shadow-card border-border p-4 text-center hover:shadow-elevated transition-all cursor-pointer">
          <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Eslatmalar</h3>
          <p className="text-sm text-muted-foreground">Muhim eslatmalar va e'lonlar</p>
        </Card>
      </div>
    </div>
  );
}