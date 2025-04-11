'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Message {
  id: string
  sender_name: string
  sender_email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const supabase = createClient()
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('You must be logged in to view messages')
          setLoading(false)
          return
        }
        
        // Fetch messages for the user
        const { data, error: messagesError } = await supabase
          .from('contact_messages')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false })
        
        if (messagesError) {
          throw messagesError
        }
        
        setMessages(data || [])
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMessages()
  }, [])
  
  // Mark a message as read
  const markAsRead = async (messageId: string) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId)
      
      if (error) {
        throw error
      }
      
      // Update the local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      )
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }
  
  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId)
      
      if (error) {
        throw error
      }
      
      // Update the local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      
      // Clear selected message if it was deleted
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }
  
  // View a message
  const viewMessage = (message: Message) => {
    setSelectedMessage(message)
    
    // Mark as read if not already read
    if (!message.read) {
      markAsRead(message.id)
    }
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">You don't have any messages yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            When someone contacts you through your profile, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b p-4">
                <h2 className="font-medium">Inbox</h2>
              </div>
              <ul className="max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <li 
                    key={message.id}
                    className={`cursor-pointer border-b p-4 transition-colors hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-indigo-50' : ''
                    } ${!message.read ? 'font-semibold' : ''}`}
                    onClick={() => viewMessage(message)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block truncate">{message.sender_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm text-gray-600">
                      {message.subject || 'No subject'}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-medium">{selectedMessage.subject || 'No subject'}</h2>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="mb-4 text-sm text-gray-500">
                  <p>From: {selectedMessage.sender_name} ({selectedMessage.sender_email})</p>
                  <p>Received: {formatDate(selectedMessage.created_at)}</p>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                
                <div className="mt-6">
                  <a
                    href={`mailto:${selectedMessage.sender_email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
                <p className="text-gray-500">Select a message to view its contents</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
