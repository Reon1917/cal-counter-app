'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { LogOut, User, Dumbbell, Settings, TrendingUp } from 'lucide-react'

export default function MainLayout({ user, children }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
      alert('Failed to log out. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">FitMacro</h1>
                <p className="text-xs text-gray-400">Nutrition Tracker</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-white">
                  {user?.email?.split('@')[0] || 'Athlete'}
                </p>
                <p className="text-xs text-gray-400">Logged in</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-10 h-10 rounded-full bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Quick Stats Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700 p-4">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="p-3 text-center">
                <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-sm font-bold text-white">AI</div>
                <div className="text-xs text-gray-400">Powered</div>
              </div>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="p-3 text-center">
                <User className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-sm font-bold text-white">Active</div>
                <div className="text-xs text-gray-400">User</div>
              </div>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="p-3 text-center">
                <Settings className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <div className="text-sm font-bold text-white">Ready</div>
                <div className="text-xs text-gray-400">To Track</div>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              Built for athletes • Powered by AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 