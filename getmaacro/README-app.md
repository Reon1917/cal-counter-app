# GetMaacro - AI Calorie Counter

A mobile-focused calorie calculator app that uses camera capture and Gemini AI to analyze food photos and provide detailed nutritional information.

## Features

- 📸 **Camera Integration**: Take photos of your food with front/back camera switching
- 🤖 **AI Analysis**: Uses Gemini 2.5 Flash to analyze food images and extract nutrition data
- 📊 **Detailed Macros**: Get calories, protein, carbs, fat, fiber, and more
- 💾 **Save Results**: Export nutrition analysis as images to your device
- ⚙️ **Custom Prompts**: Customize the AI system prompt for better analysis
- 🔐 **Secure Auth**: Supabase authentication with SSR support
- 📱 **Mobile Optimized**: Designed specifically for Nothing Phone 3a (163.52 x 77.50 mm)

## Mobile Optimization

- **Nothing Phone 3a Specific**: UI designed for 163.52 x 77.50 x 8.35 mm dimensions
- **Hole Punch Camera**: Header layout accounts for top-center camera cutout
- **Touch-Friendly**: Large buttons positioned for thumb reach
- **Responsive**: Optimized for mobile viewport and gestures

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_API_KEY=your_google_api_key  # Optional
   ```

3. **Google API Key** (Required)
   - Get your API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs)
   - Can be set in environment variables OR in app settings

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Usage

1. **Sign Up/Login**: Create account or sign in
2. **Take Photo**: Tap camera button to capture food image
3. **Analyze**: AI processes the image and returns nutrition data
4. **Save**: Export the results as an image to your device
5. **Settings**: Customize AI prompts and API configuration

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: shadcn/ui + Tailwind CSS
- **Auth**: Supabase Auth with SSR
- **AI**: Google Gemini 2.5 Flash API
- **Camera**: Web MediaDevices API
- **Export**: html2canvas for image generation

## API Integration

The app uses Gemini 2.5 Flash with a custom system prompt to analyze food images:

```javascript
// Custom system prompt for nutrition analysis
const SYSTEM_PROMPT = `You are a professional nutritionist...`

// API call structure
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  systemInstruction: customPrompt,
  contents: [/* image and text */]
})
```

## Camera Features

- **High Resolution**: 1920x1080 capture
- **Camera Switching**: Front/back camera toggle
- **Mobile Optimized**: Touch-friendly controls
- **Real-time Preview**: Live camera feed

## Nutrition Data

Returns comprehensive nutrition information:
- Calories, Protein, Carbs, Fat, Fiber
- Sugar, Sodium, Cholesterol
- Serving size estimation
- Daily value percentages
- Analysis confidence notes

## Security

- **Supabase SSR**: Secure server-side authentication
- **Protected Routes**: Middleware-based route protection
- **API Key Safety**: Client-side API key storage option
- **CORS Handling**: Proper image handling and CORS setup 