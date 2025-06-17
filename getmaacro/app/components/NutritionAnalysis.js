'use client'

import { ArrowLeft, Zap, Target, Utensils, TrendingUp } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'

export default function NutritionAnalysis({ nutritionData, foodImage, onBack }) {
  const { description, calories, protein, carbohydrates, fat } = nutritionData

  // Calculate percentages for macro distribution
  const totalMacros = protein + carbohydrates + fat
  const proteinPercentage = totalMacros > 0 ? Math.round((protein / totalMacros) * 100) : 0
  const carbsPercentage = totalMacros > 0 ? Math.round((carbohydrates / totalMacros) * 100) : 0
  const fatPercentage = totalMacros > 0 ? Math.round((fat / totalMacros) * 100) : 0

  // Calculate calories from each macro
  const proteinCalories = protein * 4
  const carbsCalories = carbohydrates * 4
  const fatCalories = fat * 9

  const MacroCard = ({ icon: Icon, name, grams, calories, percentage, color, bgColor }) => (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{calories} calories</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{grams}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">g • {percentage}%</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Button>
          
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 mr-1" />
            AI Analyzed
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Food Image & Overview */}
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={foodImage} 
                  alt="Analyzed food" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-white mb-1">
                  {description || 'Food Analysis'}
                </h1>
                <p className="text-white/80 text-sm">Complete nutritional breakdown</p>
              </div>
            </div>
          </Card>

          {/* Calories Overview */}
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-xl shadow-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">TOTAL CALORIES</p>
                  <p className="text-5xl font-bold">{calories}</p>
                  <p className="text-emerald-100 text-sm">kcal</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Macronutrients */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Utensils className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Macronutrients</h2>
            </div>
            
            <div className="grid gap-4">
              <MacroCard
                icon={TrendingUp}
                name="Protein"
                grams={protein}
                calories={proteinCalories}
                percentage={proteinPercentage}
                color="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/30"
              />
              <MacroCard
                icon={Zap}
                name="Carbohydrates"
                grams={carbohydrates}
                calories={carbsCalories}
                percentage={carbsPercentage}
                color="text-orange-600"
                bgColor="bg-orange-100 dark:bg-orange-900/30"
              />
              <MacroCard
                icon={Target}
                name="Fat"
                grams={fat}
                calories={fatCalories}
                percentage={fatPercentage}
                color="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/30"
              />
            </div>
          </div>

          {/* Macro Distribution Chart */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Macro Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Protein</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{proteinPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${proteinPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Carbs</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{carbsPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${carbsPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Fat</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{fatPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${fatPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02]"
          >
            <Utensils className="w-5 h-5 mr-2" />
            Analyze Another Meal
          </Button>

          {/* Footer */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">GetMaacro</span>
              <span className="text-xs">•</span>
              <span className="text-xs">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 