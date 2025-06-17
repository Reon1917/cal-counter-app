import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { GEMINI_SYSTEM_PROMPT, GEMINI_CONFIG } from '../../../lib/gemini'

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

// Function to parse the custom format from Gemini response
function parseCustomFormat(text) {
  const lines = text.split('\n').filter(line => line.trim())
  
  let description = ''
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0
  let considerations = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Extract description (first line or line starting with "1.")
    if (trimmed.match(/^1\.\s*Description:/)) {
      description = trimmed.replace(/^1\.\s*Description:\s*/, '')
    } else if (!description && trimmed && !trimmed.match(/^\d+\./)) {
      description = trimmed
    }
    
    // Extract calories
    if (trimmed.match(/Estimated Calories:/)) {
      const calorieMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*kcal/)
      if (calorieMatch) calories = parseFloat(calorieMatch[1])
    }
    
    // Extract macros
    if (trimmed.match(/Protein:/)) {
      const proteinMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*g/)
      if (proteinMatch) protein = parseFloat(proteinMatch[1])
    }
    
    if (trimmed.match(/Carbohydrates:/)) {
      const carbMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*g/)
      if (carbMatch) carbs = parseFloat(carbMatch[1])
    }
    
    if (trimmed.match(/Fats:/)) {
      const fatMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*g/)
      if (fatMatch) fat = parseFloat(fatMatch[1])
    }
    
    // Extract considerations
    if (trimmed.match(/Considerations:/)) {
      considerations = trimmed.replace(/^.*Considerations:\s*/, '')
    }
  }
  
  // Calculate basic percentages (rough estimates)
  const proteinPercentage = Math.round((protein * 4 / 2000) * 100)
  const carbsPercentage = Math.round((carbs * 4 / 2000) * 100)
  const fatPercentage = Math.round((fat * 9 / 2000) * 100)
  
  return {
    foodName: description.split('.')[0] || 'Food Analysis',
    description: description,
    calories: calories,
    protein: protein,
    carbs: carbs,
    fat: fat,
    fiber: 0, // Not provided in custom format
    sugar: 0, // Not provided in custom format
    sodium: 0, // Not provided in custom format
    cholesterol: 0, // Not provided in custom format
    servingSize: 'Standard serving',
    proteinPercentage: proteinPercentage,
    carbsPercentage: carbsPercentage,
    fatPercentage: fatPercentage,
    fiberPercentage: 0,
    notes: considerations || 'Analysis based on visual inspection'
  }
}

// No additional formatting instructions - using only the custom prompt from gemini.js

export async function POST(request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
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
              text: "Analyze this food image and provide nutritional information following the specified format."
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

    const text = response.text

    // Clean up the response to ensure it's valid JSON
    let cleanedText = text.trim()
    
    // Remove any markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '')
    }

    try {
      const nutritionData = JSON.parse(cleanedText)
      
      // Validate required fields
      const requiredFields = ['foodName', 'calories', 'protein', 'carbs', 'fat']
      const missingFields = requiredFields.filter(field => 
        nutritionData[field] === undefined || nutritionData[field] === null
      )

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      return NextResponse.json(nutritionData)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw response:', text)
      
      // Try to parse the custom format if JSON parsing fails
      try {
        const parsedData = parseCustomFormat(text)
        return NextResponse.json(parsedData)
      } catch (customParseError) {
        console.error('Custom parsing error:', customParseError)
        
        // Final fallback response
        return NextResponse.json({
          foodName: 'Food Analysis',
          description: text.split('\n')[0] || 'Unable to parse analysis',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          cholesterol: 0,
          servingSize: 'Unknown',
          proteinPercentage: 0,
          carbsPercentage: 0,
          fatPercentage: 0,
          fiberPercentage: 0,
          notes: 'Raw AI response format - please check the description field'
        })
      }
    }

  } catch (error) {
    console.error('Food analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food image' },
      { status: 500 }
    )
  }
} 