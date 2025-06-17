'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { Dumbbell, Mail, Lock, Zap, Target, TrendingUp } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setError('Check your email for verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Status Bar Spacer */}
      <div className="h-safe-top bg-transparent"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform">
              <Dumbbell className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-orange-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            FitMacro
          </h1>
          <p className="text-lg text-emerald-400 mb-2 font-semibold">
            AI Nutrition Tracking
          </p>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            Track your macros like a pro. Built for athletes and fitness enthusiasts.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8 w-full max-w-sm">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-3 text-center">
              <Target className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">Precise</div>
              <div className="text-xs text-gray-400">AI Analysis</div>
            </div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-3 text-center">
              <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">Fast</div>
              <div className="text-xs text-gray-400">Tracking</div>
            </div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-3 text-center">
              <Zap className="w-6 h-6 text-orange-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">Smart</div>
              <div className="text-xs text-gray-400">Insights</div>
            </div>
          </Card>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-sm bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Join FitMacro' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-gray-400">
                {isSignUp ? 'Start tracking your nutrition' : 'Continue your fitness journey'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12 h-14 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  <>
                    <Dumbbell className="w-5 h-5 mr-2" />
                    {isSignUp ? 'Start Training' : 'Continue Training'}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Built for athletes • Powered by AI
          </p>
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-safe-bottom bg-transparent"></div>
    </div>
  )
}