'use client'

import { useState, useRef } from 'react'
import { Download, RotateCcw, Utensils } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import html2canvas from 'html2canvas'

export default function NutritionAnalysis({ image, data, onRetake }) {
  const [isSaving, setIsSaving] = useState(false)
  const cardRef = useRef(null)

  const saveAsImage = async () => {
    if (!cardRef.current) return
    
    setIsSaving(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: cardRef.current.scrollHeight,
        width: cardRef.current.scrollWidth
      })
      
      // Create download link
      const link = document.createElement('a')
      link.download = `nutrition-analysis-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error saving image:', error)
      alert('Failed to save image. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const MacroCard = ({ label, value, unit, color, percentage }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <Badge variant="secondary" className={`${color} text-white`}>
          {percentage}%
        </Badge>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}
        <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div ref={cardRef} className="p-4 space-y-4">
          {/* Food Image */}
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={image}
                alt="Analyzed food"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500 text-white">
                  <Utensils className="w-3 h-3 mr-1" />
                  Analyzed
                </Badge>
              </div>
            </div>
          </Card>

          {/* Food Name & Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{data.foodName || 'Food Analysis'}</CardTitle>
              {data.description && (
                <p className="text-sm text-gray-600">{data.description}</p>
              )}
            </CardHeader>
          </Card>

          {/* Calories */}
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {data.calories || 0}
                </div>
                <div className="text-sm opacity-90">Total Calories</div>
              </div>
            </CardContent>
          </Card>

          {/* Macronutrients Grid */}
          <div className="grid grid-cols-2 gap-3">
            <MacroCard
              label="Protein"
              value={data.protein || 0}
              unit="g"
              color="bg-blue-500"
              percentage={data.proteinPercentage || 0}
            />
            <MacroCard
              label="Carbs"
              value={data.carbs || 0}
              unit="g"
              color="bg-green-500"
              percentage={data.carbsPercentage || 0}
            />
            <MacroCard
              label="Fat"
              value={data.fat || 0}
              unit="g"
              color="bg-yellow-500"
              percentage={data.fatPercentage || 0}
            />
            <MacroCard
              label="Fiber"
              value={data.fiber || 0}
              unit="g"
              color="bg-purple-500"
              percentage={data.fiberPercentage || 0}
            />
          </div>

          {/* Additional Nutrients */}
          {(data.sugar || data.sodium || data.cholesterol) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Additional Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.sugar && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sugar</span>
                    <span className="font-medium">{data.sugar}g</span>
                  </div>
                )}
                {data.sodium && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sodium</span>
                    <span className="font-medium">{data.sodium}mg</span>
                  </div>
                )}
                {data.cholesterol && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cholesterol</span>
                    <span className="font-medium">{data.cholesterol}mg</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Serving Size */}
          {data.servingSize && (
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Estimated Serving Size</div>
                  <div className="font-medium">{data.servingSize}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Notes */}
          {data.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analysis Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{data.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timestamp */}
          <div className="text-center text-xs text-gray-500 py-2">
            Analyzed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRetake}
            className="flex-1 h-12"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Photo
          </Button>
          <Button
            onClick={saveAsImage}
            disabled={isSaving}
            className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Download className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Image'}
          </Button>
        </div>
      </div>
    </div>
  )
} 