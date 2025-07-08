"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X, Package, Tag, AlertCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { notificationService, type Notification } from "@/lib/notifications"
import { useAuth } from "@/contexts/auth-context"

export function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
      loadUnreadCount()
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return
    const data = await notificationService.getNotifications(user.id)
    setNotifications(data)
  }

  const loadUnreadCount = async () => {
    if (!user) return
    const count = await notificationService.getUnreadCount(user.id)
    setUnreadCount(count)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId)
    setNotifications(
      notifications.map((n) => (n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n)),
    )
    setUnreadCount(Math.max(0, unreadCount - 1))
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    await notificationService.markAllAsRead(user.id)
    setNotifications(notifications.map((n) => ({ ...n, readAt: new Date().toISOString() })))
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4" />
      case "promotion":
        return <Tag className="h-4 w-4" />
      case "system":
        return <AlertCircle className="h-4 w-4" />
      case "support":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Agora há pouco"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  if (!user) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificações</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-muted/50 transition-colors ${
                        !notification.readAt ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${!notification.readAt ? "text-blue-600" : "text-muted-foreground"}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${!notification.readAt ? "text-gray-900" : "text-gray-600"}`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.createdAt)}</p>
                            </div>
                            {!notification.readAt && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-2"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
