'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, LogOut } from 'lucide-react'
import { Button } from '../../components/ui/button'
import Settings from './Settings'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function MainLayout({ user, children }) {
  const [showSettings, setShowSettings] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Status bar area for Nothing Phone 3a */}
      <div className="h-6 bg-black/5"></div>
      
      {/* Header with hole punch camera consideration */}
      <div className="relative px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="w-8 h-8"
          >
            <SettingsIcon className="w-4 h-4" />
          </Button>
          
          <h1 className="text-xl font-bold text-gray-900 text-center">
            GetMaacro
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="w-8 h-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {children}

      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
} 