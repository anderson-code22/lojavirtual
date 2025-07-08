"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Send, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { sendWelcomeMessage } from "@/lib/chat-utils" // Declare the variable before using it

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  messageType: "text" | "image" | "file"
  createdAt: string
  isAgent: boolean
}

interface ChatSession {
  id: string
  status: "open" | "in_progress" | "closed"
  subject?: string
}

export function ChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && user && !chatSession) {
      initializeChat()
    }
  }, [isOpen, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeChat = async () => {
    if (!user) return

    try {
      // Verificar se já existe uma sessão ativa
      const { data: existingSession } = await supabase
        .from("support_chats")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["open", "in_progress"])
        .single()

      if (existingSession) {
        setChatSession(existingSession)
        await loadMessages(existingSession.id)
      } else {
        // Criar nova sessão
        const { data: newSession } = await supabase
          .from("support_chats")
          .insert({
            user_id: user.id,
            status: "open",
            subject: "Suporte Geral",
          })
          .select()
          .single()

        if (newSession) {
          setChatSession(newSession)
          // Enviar mensagem de boas-vindas
          await sendWelcomeMessage(newSession.id)
        }
      }
    } catch (error) {
      console.error("Erro ao inicializar chat:", error)
    }
  }

  const loadMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          users (name)
        `,
        )
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true })

      if (error) throw error

      const formattedMessages: ChatMessage[] = data?.map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.users?.name || "Unknown",
        message: msg.message,
        messageType: msg.message_type,
        createdAt: msg.created_at,
        isAgent: msg.is_agent,
      }))

      setMessages(formattedMessages || [])
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error)
    }
  }

  // Function to send a new message
  const sendMessage = async () => {
    if (!user || !chatSession || !newMessage) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          chat_id: chatSession.id,
          sender_id: user.id,
          message: newMessage,
          message_type: "text",
          is_agent: false,
        })
        .select()
        .single()

      if (error) throw error

      setMessages((prevMessages) => [...prevMessages, data])
      setNewMessage("")
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  // Function to handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <div
      className={`fixed bottom-0 right-0 ${isMinimized ? "w-10" : "w-80"} bg-white shadow-lg rounded-lg transition-all duration-300`}
    >
      {isMinimized ? (
        <Button onClick={() => setIsMinimized(false)} className="w-full h-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Suporte
              <Button onClick={() => setIsMinimized(true)} variant="ghost" className="p-0">
                <Minimize2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ScrollArea className="h-full">
              <div className="flex flex-col space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isAgent ? "justify-end" : "justify-start"}`}>
                    <Avatar>
                      <AvatarImage src={msg.isAgent ? "/agent-avatar.png" : "/user-avatar.png"} alt="Avatar" />
                      <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`bg-gray-100 p-4 rounded-lg ${msg.isAgent ? "ml-2" : "mr-2"}`}>{msg.message}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <form onSubmit={handleSubmit} className="flex p-4">
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={handleInputChange}
              className="flex-1 mr-2"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
