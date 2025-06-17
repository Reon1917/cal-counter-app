import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { GEMINI_SYSTEM_PROMPT } from '../../../lib/gemini'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      systemInstruction: GEMINI_SYSTEM_PROMPT,
      contents: [
        {
          parts: [
            {
              text: "Analyze this food image and return ONLY a JSON object with the exact format specified in the system prompt. Do not include any other text or explanation."
            },
            {
              inlineData: {
                data: image,
                mimeType: 'image/jpeg'
              }
            }
          ]
        }
      ]
    })

    let text = response.text.trim()
    console.log('Raw AI response:', text)

    // Clean up the response to ensure it's valid JSON
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/, '').replace(/\n?```$/, '')
    }

    try {
      const nutritionData = JSON.parse(text)
      
      // Handle different response formats and normalize to our expected format
      let normalizedData = {
        description: '',
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0
      }

      // If we get the old complex format, extract the totals
      if (nutritionData.total_calories || nutritionData.components) {
        normalizedData.calories = parseInt(nutritionData.total_calories?.replace(/[^\d]/g, '')) || 0
        normalizedData.protein = parseInt(nutritionData.total_protein?.replace(/[^\d]/g, '')) || 0
        normalizedData.carbohydrates = parseInt(nutritionData.total_carbohydrates?.replace(/[^\d]/g, '')) || 0
        normalizedData.fat = parseInt(nutritionData.total_fat?.replace(/[^\d]/g, '')) || 0
        normalizedData.description = 'Food Analysis'
      } 
      // If we get the new simple format
      else if (nutritionData.description && nutritionData.calories !== undefined) {
        normalizedData = {
          description: nutritionData.description,
          calories: Number(nutritionData.calories) || 0,
          protein: Number(nutritionData.protein) || 0,
          carbohydrates: Number(nutritionData.carbohydrates) || 0,
          fat: Number(nutritionData.fat) || 0
        }
      }
      // Fallback for any other format
      else {
        throw new Error('Unexpected response format')
      }

      console.log('Normalized data:', normalizedData)
      return NextResponse.json(normalizedData)

    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw response:', text)
      
      // Fallback response if JSON parsing fails
      return NextResponse.json({
        description: 'Food Analysis',
        calories: 800,
        protein: 30,
        carbohydrates: 60,
        fat: 25,
        error: 'Unable to parse nutrition data, using estimated values'
      })
    }

  } catch (error) {
    console.error('Food analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food image' },
      { status: 500 }
    )
  }
} 