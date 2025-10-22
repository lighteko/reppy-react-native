# Reppy - AI Fitness Coach Mobile App

A comprehensive React Native mobile application built with Expo, TypeScript, and NativeWind for personalized fitness coaching powered by AI.

## Features

### Core Functionality
- **AI-Powered Chat**: Conversational interface with Reppy, your AI fitness coach
- **Personalized Programs**: Custom workout programs generated based on your goals, experience, and available equipment
- **Workout Tracking**: Log sets, reps, and weights with an intuitive interface
- **Rest Timer**: Automatic countdown timer between sets
- **Progress Stats**: Calendar view and workout history tracking
- **Equipment Management**: Comprehensive equipment selection and management

### User Experience
- **Onboarding Flow**: Chat-based onboarding to collect user preferences
- **Authentication**: Secure login and signup system
- **Profile Management**: Edit body metrics and preferences
- **Multi-language Support**: Configurable locale settings
- **Unit System Toggle**: Switch between metric (kg/cm) and imperial (lbs/in)

## Tech Stack

### Frontend
- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native)
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **Lucide React Native** for icons

### Backend Integration
- **Axios** for API calls
- **Supabase** integration ready
- **AsyncStorage** for local persistence

### Utilities
- **date-fns** for date formatting and manipulation
- **React Native Gesture Handler** for touch interactions
- **React Native Reanimated** for animations

## Project Structure

```
/reppy-app
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── home.tsx         # Home screen with program overview
│   │   ├── chat.tsx         # Chat with Reppy
│   │   ├── stats.tsx        # Progress tracking
│   │   └── settings.tsx     # Settings and equipment management
│   ├── routine/[id].tsx     # Routine detail screen
│   ├── workout/[sessionId].tsx  # Active workout session
│   ├── auth.tsx             # Login/Signup
│   ├── onboarding.tsx       # Chat-based onboarding
│   └── index.tsx            # Initial routing logic
│
├── components/              # Reusable UI components
│   ├── common/             # General components (Button, TextInput, Card, etc.)
│   ├── workout/            # Workout-specific components
│   └── chat/               # Chat interface components
│
├── store/                  # Zustand state management
│   ├── userStore.ts        # User authentication and profile
│   ├── programStore.ts     # Active program and routines
│   └── workoutStore.ts     # Active workout session
│
├── services/               # API integration layer
│   ├── api.ts              # Base API client with interceptors
│   ├── authService.ts      # Authentication endpoints
│   ├── userService.ts      # User profile management
│   ├── programService.ts   # Program generation and retrieval
│   ├── workoutService.ts   # Workout session tracking
│   ├── chatService.ts      # Chat messaging
│   └── equipmentService.ts # Equipment management
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication logic
│   ├── useWorkout.ts       # Workout session management
│   ├── useRestTimer.ts     # Rest timer countdown
│   └── useChat.ts          # Chat messaging and streaming
│
├── types/                  # TypeScript type definitions
│   ├── enums.ts            # Enumerations matching backend schema
│   ├── user.ts             # User-related types
│   ├── equipment.ts        # Equipment types
│   ├── exercise.ts         # Exercise and muscle types
│   ├── program.ts          # Program and routine types
│   ├── workout.ts          # Workout session and recording types
│   ├── chat.ts             # Chat message types
│   └── api.ts              # API response types
│
└── utils/                  # Utility functions
    ├── formatting.ts       # Date and text formatting
    ├── validation.ts       # Input validation
    ├── conversion.ts       # Unit conversions
    ├── calculations.ts     # Workout calculations
    ├── storage.ts          # AsyncStorage wrappers
    └── error.ts            # Error handling
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Update `.env` with your API endpoint:
```
EXPO_PUBLIC_API_URL=your_backend_api_url
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

### Development Commands

```bash
npm run dev          # Start development server
npm run build:web    # Build for web platform
npm run lint         # Run linter
npm run typecheck    # Run TypeScript type checking
```

## Key Features Implementation

### State Management
The app uses Zustand for lightweight, performant state management:
- **userStore**: Manages authentication, user profile, and equipment
- **programStore**: Handles active program and routine data
- **workoutStore**: Tracks active workout sessions with persistence

### Navigation
File-based routing with Expo Router:
- Tab navigation for main screens (Home, Chat, Stats, Settings)
- Stack navigation for detail screens (Routine, Workout Session)
- Authentication flow handling with automatic redirects

### Styling
NativeWind brings Tailwind CSS to React Native:
- Utility-first styling approach
- Responsive design system
- Custom theme with primary (blue) and secondary (green) colors
- Dark mode support ready

### API Integration
Axios-based service layer with:
- Automatic token injection via interceptors
- Centralized error handling
- Type-safe request/response handling
- Streaming support for chat messages

### Local Persistence
AsyncStorage integration for:
- Authentication tokens
- Active workout session recovery
- Onboarding progress

## Design Philosophy

### User Experience
- **Clean and Modern**: Fitness-focused design with energetic blue and green color palette
- **Intuitive Navigation**: Tab-based navigation for quick access to main features
- **Progressive Disclosure**: Complex features revealed contextually
- **Feedback-First**: Loading states, error messages, and success confirmations

### Code Quality
- **Type Safety**: Comprehensive TypeScript types matching backend schema
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Reusability**: Modular components and hooks for code reuse
- **Error Handling**: Graceful error recovery with user-friendly messages

## Backend Integration

The app expects a REST API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/:userId/profile` - Get user profile
- `PUT /api/users/:userId/profile` - Update profile
- `GET/PUT /api/users/:userId/equipment` - Manage equipment

### Program Management
- `POST /api/programs/generate` - Generate new program
- `GET /api/users/:userId/programs/active` - Get active program
- `GET /api/routines/:routineId` - Get routine details

### Workout Tracking
- `POST /api/workouts/sessions` - Start workout session
- `POST /api/workouts/sessions/:sessionId/sets` - Log set performance
- `PUT /api/workouts/sessions/:sessionId/finish` - Finish session
- `GET /api/users/:userId/workouts/history` - Get workout history

### Chat
- `POST /api/chat/messages` - Send message
- `POST /api/chat/messages/stream` - Stream AI response
- `GET /api/chat/messages` - Get chat history

## Future Enhancements

- Push notifications for workout reminders
- Social features and workout sharing
- Advanced analytics and progress charts
- Exercise video demonstrations
- Offline mode support
- Apple Health / Google Fit integration

## License

Private - All Rights Reserved
