'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, Camera } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import NutritionAnalysis from './NutritionAnalysis'

export default function FoodUpload() {
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [nutritionData, setNutritionData] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const processImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const size = Math.min(img.width, img.height)
        canvas.width = size
        canvas.height = size
        
        const ctx = canvas.getContext('2d')
        const startX = (img.width - size) / 2
        const startY = (img.height - size) / 2
        
        ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size)
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        setUploadedImage(imageData)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0]
    if (file) {
      processImageFile(file)
    }
    event.target.value = ''
  }, [processImageFile])

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      processImageFile(files[0])
    }
  }, [processImageFile])

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const clearImage = useCallback(() => {
    setUploadedImage(null)
    setNutritionData(null)
  }, [])

  const analyzeFood = useCallback(async () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    try {
      const base64Data = uploadedImage.split(',')[1]

      const analysisResponse = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data }),
      })

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed')
      }

      const data = await analysisResponse.json()
      setNutritionData(data)
    } catch (error) {
      console.error('Error analyzing food:', error)
      alert('Failed to analyze food. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [uploadedImage])

  if (nutritionData) {
    return (
      <NutritionAnalysis 
        nutritionData={nutritionData} 
        foodImage={uploadedImage}
        onBack={clearImage}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Food Analysis
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Upload a photo to get instant AI-powered nutrition insights
            </p>
          </div>
        </div>

        {!uploadedImage ? (
          /* Upload Area */
          <Card 
            className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer group ${
              isDragOver 
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-500/10' 
                : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Upload Icon */}
                <div className={`relative mx-auto transition-all duration-300 ${
                  isDragOver ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragOver 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30' 
                      : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-emerald-50 group-hover:to-teal-50 dark:group-hover:from-emerald-900/20 dark:group-hover:to-teal-900/20'
                  }`}>
                    <Upload className={`w-12 h-12 transition-all duration-300 ${
                      isDragOver 
                        ? 'text-white' 
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'
                    }`} />
                  </div>
                  {isDragOver && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl animate-pulse opacity-20"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {isDragOver ? 'Drop your photo here' : 'Upload Food Photo'}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-slate-600 dark:text-slate-400">
                      Drag & drop or tap to select
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      JPG, PNG, WebP up to 10MB
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02]"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Choose Photo
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Preview & Analysis */
          <div className="space-y-6">
            <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="relative">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded food" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm border border-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
                  <div className="flex items-center space-x-2 text-white">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Ready for analysis</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Analyze Your Food
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Get detailed nutrition breakdown powered by AI
                  </p>
                </div>
                
                <Button
                  onClick={analyzeFood}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing nutrition...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Start Analysis</span>
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 