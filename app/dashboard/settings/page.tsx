'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      
      <div className="mb-6 flex border-b">
        <button
          onClick={() => setActiveTab('account')}
          className={`mr-4 border-b-2 px-4 py-2 ${
            activeTab === 'account' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`mr-4 border-b-2 px-4 py-2 ${
            activeTab === 'notifications' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`mr-4 border-b-2 px-4 py-2 ${
            activeTab === 'appearance' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Appearance
        </button>
      </div>

      {activeTab === 'account' && (
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">Account Information</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Manage your account details and password
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <p className="mt-1 text-sm">user@example.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <button className="mt-1 text-sm text-primary hover:underline">
                  Change password
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium text-destructive">Danger Zone</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Permanently delete your account and all of your content
            </p>
            <button className="rounded bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-medium">Notification Preferences</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Manage how you receive notifications
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email notifications</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Client Form Submissions</p>
                <p className="text-sm text-muted-foreground">Get notified when a client submits a form</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about payment events</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-medium">Appearance Settings</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Customize how your dashboard looks
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Theme</label>
              <div className="mt-2 flex space-x-2">
                <button className="h-10 w-10 rounded-full bg-white border shadow-sm"></button>
                <button className="h-10 w-10 rounded-full bg-gray-900 border shadow-sm"></button>
                <button className="h-10 w-10 rounded-full bg-blue-600 border shadow-sm"></button>
                <button className="h-10 w-10 rounded-full bg-purple-600 border shadow-sm"></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
