// gemini.ts
import { GoogleGenAI } from "@google/genai";
import { GeminiResponse } from '../types'
import { Config } from '../constants/config'

const GEMINI_API_KEY = Config.gemini.apiKey
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function analyzeFoodImage(imageBase64: string): Promise<GeminiResponse> {
  const prompt = `
    Analyze this food image and provide detailed nutritional information. 
    Return ONLY a JSON object with this exact structure:
    {
      "macroInfo": {
        "calories": number,
        "protein": number (in grams),
        "carbs": number (in grams),
        "fat": number (in grams),
        "fiber": number (in grams),
        "sugar": number (in grams),
        "sodium": number (in mg),
        "servingSize": "description of serving size",
        "foodName": "name of the food item"
      },
      "confidence": number (0-100),
      "analysis": "brief description of what you see and how you calculated the values"
    }
    
    Be as accurate as possible. If you can't identify the food clearly, set confidence to a lower value.
    Estimate serving sizes based on typical portions visible in the image.
    Focus on Asian cuisines, particularly Thai food common in Thailand.
  `

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }
      ]
    });

    const text = response.text || '';
    
    // Clean up the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API')
    }

    const result = JSON.parse(jsonMatch[0])
    return result as GeminiResponse
  } catch (error) {
    console.error('Error analyzing food image:', error)
    throw error
  }
}
