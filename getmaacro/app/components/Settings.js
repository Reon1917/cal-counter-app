'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, X, Info } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function Settings({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            About GetMaacro
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium">AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Uses Gemini 2.5 Flash AI with specialized knowledge of Asian cuisines, 
                  particularly Thai food, for accurate calorie and macro analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium">Specialized for Thai Cuisine</h3>
                <p className="text-sm text-gray-600">
                  Optimized for Asian cooking methods and ingredients, accounting for 
                  common oils and preparation styles typical in Thai restaurants.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium">Mobile Optimized</h3>
                <p className="text-sm text-gray-600">
                  Designed specifically for Nothing Phone 3a with consideration for 
                  the hole-punch camera and mobile-first user experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium">Privacy & Security</h3>
                <p className="text-sm text-gray-600">
                  Images are processed securely and not stored. All analysis happens 
                  through encrypted connections with proper authentication.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p className="font-medium mb-1">GetMaacro v1.0</p>
              <p>AI-Powered Calorie Counter</p>
            </div>
          </div>
        </CardContent>

        <div className="p-4 border-t bg-gray-50">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
} 