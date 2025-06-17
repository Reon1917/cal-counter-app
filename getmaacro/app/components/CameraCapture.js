'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, FlipHorizontal, Loader2, Save } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import NutritionAnalysis from './NutritionAnalysis'

export default function CameraCapture() {
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [nutritionData, setNutritionData] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // back camera
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = useCallback(async () => {
    setCameraLoading(true)
    try {
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }

      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      setStream(mediaStream)
      setCameraActive(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(console.error)
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setCameraActive(false)
      setStream(null)
      
      let errorMessage = 'Camera access failed. '
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please enable camera permissions in your browser settings.'
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported on this device.'
      } else {
        errorMessage += 'Please check your camera permissions and try again.'
      }
      
      alert(errorMessage)
    } finally {
      setCameraLoading(false)
    }
  }, [facingMode, stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setCameraActive(false)
    }
  }, [stream])

  const flipCamera = useCallback(() => {
    stopCamera()
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
    setTimeout(() => startCamera(), 100)
  }, [stopCamera, startCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage)
      setCapturedImage(null)
    }
    setNutritionData(null)
    startCamera()
  }, [capturedImage, startCamera])

  const analyzeFood = useCallback(async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    try {
      // Convert image to base64
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(blob)
      })

      // Call Gemini API
      const analysisResponse = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
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
  }, [capturedImage])

  // Mobile-optimized dimensions for Nothing Phone 3a (163.52 x 77.50 mm)
  return (
    <div className="flex-1 flex flex-col">
      {!capturedImage && !cameraActive && (
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Snap Your Food
              </h2>
              <p className="text-gray-600 text-sm">
                Take a photo of your meal to get instant nutrition analysis
              </p>
            </div>
            <Button 
              onClick={startCamera}
              disabled={cameraLoading}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
            >
              {cameraLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Starting Camera...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </>
              )}
            </Button>
          </Card>
        </div>
      )}

      {cameraActive && (
        <div className="flex-1 relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Video error:', e)
              setCameraActive(false)
              setStream(null)
              alert('Video playback failed. Please try again.')
            }}
          />
          
          {/* Camera controls - positioned for thumb reach */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={flipCamera}
                className="w-12 h-12 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <FlipHorizontal className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-white/50 hover:bg-gray-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300"></div>
              </Button>
              
              <div className="w-12 h-12"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>
      )}

      {capturedImage && !nutritionData && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <img
              src={capturedImage}
              alt="Captured food"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4 bg-white border-t">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="flex-1 h-12"
              >
                Retake
              </Button>
              <Button
                onClick={analyzeFood}
                disabled={isAnalyzing}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Food'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {nutritionData && (
        <NutritionAnalysis
          image={capturedImage}
          data={nutritionData}
          onRetake={retakePhoto}
        />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 