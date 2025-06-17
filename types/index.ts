export interface MacroInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  servingSize: string
  foodName: string
}

export interface FoodEntry {
  id: string
  user_id: string
  image_uri: string
  macro_info: MacroInfo
  created_at: string
  notes?: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface GeminiResponse {
  macroInfo: MacroInfo
  confidence: number
  analysis: string
} 