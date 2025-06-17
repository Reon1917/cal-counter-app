# MacroSnap 📸🥗

A sleek calorie calculator app designed for Nothing Phone 3a that uses AI to analyze food photos and provide detailed nutritional information.

## Features

- 📷 **Smart Food Analysis**: Uses Google Gemini AI to analyze food photos
- 🔢 **Detailed Macros**: Get calories, protein, carbs, fat, fiber, sugar, and sodium
- 💾 **Save Results**: Save analyzed photos with macro overlays to your gallery
- 🎨 **Nothing Phone Design**: Optimized UI for Nothing Phone 3a with hole-punch camera indicator
- 🌙 **Dark Theme**: Beautiful dark interface matching Nothing Phone aesthetic
- 📱 **Native Performance**: Built with React Native and Expo

## Nothing Phone 3a Optimizations

- **Dimensions**: Optimized for 163.52 x 77.50 x 8.35 mm form factor
- **Display**: 6.67" screen with hole-punch camera accommodation
- **UI/UX**: Dark theme with Nothing Phone inspired colors and animations
- **Performance**: Smooth 120Hz display optimized interactions

## Setup Instructions

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd macrosnap

# Install dependencies
npm install

# Start the development server
npm run android
```

### 3. API Configuration

#### Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Update `constants/config.ts` with your Supabase credentials

#### Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update `constants/config.ts` with your Gemini API key

#### Update Configuration
```typescript
// constants/config.ts
export const Config = {
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key-here',
  },
  gemini: {
    apiKey: 'your-gemini-api-key-here',
  },
}
```

### 4. Database Schema (Supabase)

Create these tables in your Supabase project:

```sql
-- Users table (handled by Supabase Auth)
-- Food entries table
CREATE TABLE food_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_uri TEXT NOT NULL,
  macro_info JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Policy for users to access their own data
CREATE POLICY "Users can view their own food entries" ON food_entries
  FOR ALL USING (auth.uid() = user_id);
```

## Development

### Available Scripts

- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser
- `npm start` - Start Expo development server

### Project Structure

```
macrosnap/
├── components/
│   └── ui/           # Reusable UI components
├── constants/        # App constants and configuration
├── lib/             # Utility libraries (Supabase, Gemini)
├── screens/         # App screens
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
└── global.css       # Global styles (NativeWind)
```

## Usage

1. **Take Photo**: Use the camera to capture food images
2. **Gallery Import**: Import existing photos from your gallery
3. **AI Analysis**: Gemini AI analyzes the food and provides macro information
4. **Review Results**: View detailed nutritional breakdown with confidence score
5. **Save**: Save the analyzed image with macro overlay to your gallery

## Tech Stack

- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Google Gemini API for food analysis
- **Camera**: Expo Camera
- **Icons**: Lucide React Native
- **Language**: TypeScript

## Design Philosophy

MacroSnap follows Nothing Phone's design principles:
- **Minimalism**: Clean, uncluttered interface
- **Dark-first**: Beautiful dark theme as primary
- **Glyph-inspired**: Subtle lighting effects and animations
- **Transparency**: Glass-like UI elements
- **Bold Typography**: Clear, readable fonts

## Permissions

The app requires the following permissions:
- **Camera**: To capture food photos
- **Photo Library**: To import and save images
- **Storage**: To save analyzed images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue on GitHub.

---

Made with ❤️ for Nothing Phone users 