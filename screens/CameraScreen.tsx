import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { Camera, FlipHorizontal, Image as ImageIcon, Save, X } from 'lucide-react-native'
import { Colors } from '../constants/colors'
import { Button } from '../components/ui/Button'
import { MacroCard } from '../components/ui/MacroCard'
import { analyzeFoodImage } from '../lib/gemini'
import { GeminiResponse } from '../types'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Nothing Phone 3a dimensions: 163.52 x 77.50 x 8.35 mm
// Optimized for 6.67" display with hole-punch camera at top center
const CAMERA_ASPECT_RATIO = 4 / 3
const CAMERA_HEIGHT = screenWidth * CAMERA_ASPECT_RATIO

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<GeminiResponse | null>(null)
  const cameraRef = useRef<CameraView>(null)

  useEffect(() => {
    requestPermissions()
  }, [])

  const requestPermissions = async () => {
    if (!permission?.granted) {
      await requestPermission()
    }
    if (!mediaPermission?.granted) {
      await requestMediaPermission()
    }
  }

  const takePicture = async () => {
    if (!cameraRef.current) return

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      })
      
      if (photo?.uri) {
        setCapturedImage(photo.uri)
        if (photo.base64) {
          await analyzeImage(photo.base64)
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture')
      console.error(error)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri)
      if (result.assets[0].base64) {
        await analyzeImage(result.assets[0].base64)
      }
    }
  }

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true)
    try {
      const result = await analyzeFoodImage(base64)
      setAnalysisResult(result)
    } catch (error) {
      Alert.alert('Analysis Error', 'Failed to analyze the image. Please try again.')
      console.error(error)
    } finally {
      setAnalyzing(false)
    }
  }

  const saveImage = async () => {
    if (!capturedImage || !analysisResult) return

    try {
      // Create a combined image with macro info overlay
      const asset = await MediaLibrary.createAssetAsync(capturedImage)
      await MediaLibrary.createAlbumAsync('MacroSnap', asset, false)
      
      Alert.alert('Success', 'Image saved to MacroSnap album!')
    } catch (error) {
      Alert.alert('Error', 'Failed to save image')
      console.error(error)
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setAnalysisResult(null)
  }

  const toggleCameraFacing = () => {
    setFacing(current => current === 'back' ? 'front' : 'back')
  }

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color={Colors.primary} />
          <Text style={[styles.permissionText, { color: Colors.dark.text }]}>
            MacroSnap needs camera access to analyze food photos
          </Text>
          <Button title="Grant Permission" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    )
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetCapture} style={styles.headerButton}>
            <X size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.dark.text }]}>MacroSnap</Text>
          <TouchableOpacity onPress={saveImage} style={styles.headerButton} disabled={!analysisResult}>
            <Save size={24} color={analysisResult ? Colors.primary : Colors.dark.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          </View>

          {analyzing && (
            <View style={styles.analyzingContainer}>
              <Text style={[styles.analyzingText, { color: Colors.dark.textSecondary }]}>
                Analyzing your food...
              </Text>
            </View>
          )}

          {analysisResult && (
            <View style={styles.macroContainer}>
              <MacroCard macroInfo={analysisResult.macroInfo} />
              
              <View style={styles.confidenceContainer}>
                <Text style={[styles.confidenceLabel, { color: Colors.dark.textSecondary }]}>
                  Analysis Confidence
                </Text>
                <View style={styles.confidenceBar}>
                  <View 
                    style={[
                      styles.confidenceFill, 
                      { 
                        width: `${analysisResult.confidence}%`,
                        backgroundColor: analysisResult.confidence > 70 ? Colors.success : 
                                       analysisResult.confidence > 50 ? Colors.warning : Colors.error
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.confidenceText, { color: Colors.dark.text }]}>
                  {analysisResult.confidence}%
                </Text>
              </View>

              <Text style={[styles.analysisText, { color: Colors.dark.textSecondary }]}>
                {analysisResult.analysis}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <View style={styles.header}>
        <View style={styles.headerButton} />
        <Text style={[styles.headerTitle, { color: Colors.dark.text }]}>MacroSnap</Text>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.headerButton}>
          <FlipHorizontal size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
        
        {/* Hole-punch camera indicator for Nothing Phone 3a */}
        <View style={styles.holePunchIndicator} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={pickImage} style={styles.controlButton}>
          <ImageIcon size={28} color={Colors.dark.text} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <View style={styles.controlButton} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  holePunchIndicator: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  capturedImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  macroContainer: {
    gap: 20,
    paddingBottom: 30,
  },
  confidenceContainer: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: Colors.dark.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: Colors.dark.surface,
    padding: 16,
    borderRadius: 12,
  },
}) 