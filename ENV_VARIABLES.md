# Environment Variables Configuration

This document lists all environment variables used in the MediOps application. Create a `.env` file in the root directory with these variables.

## Server Configuration

```env
PORT=5001
BACKEND_PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Database Configuration

```env
MONGODB_URI=mongodb://localhost:27017/mediops
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mediops
```

## Authentication

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## AI Services

### Google Gemini API (Required)
```env
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash-exp
```
Required for AI agent and PDF analysis features.
- Default model: `gemini-2.0-flash-exp` (available in v1beta API)
- Alternative models: `gemini-1.5-pro`, `gemini-1.5-flash`
- The system includes automatic retry logic with exponential backoff for rate limit errors
- Get your API key from: https://makersuite.google.com/app/apikey

## Air Quality API (Required)

**⚠️ IMPORTANT:** AQI API is now required. Mock data fallback has been removed.

### Option 1: OpenAQ API
```env
AQI_API_URL=https://api.openaq.org/v2/latest
AQI_API_KEY=your-openaq-api-key-if-needed
AQI_API_NAME=openaq
```

### Option 2: AirVisual API (Currently Configured - Recommended)
```env
AIR_VISUAL_API_KEY=your-air-visual-api-key-here
# Air Visual API is automatically used for AQI data
# Updates every 5 minutes automatically
# Get your free API key at: https://www.iqair.com/us/air-pollution-data-api
```

## Weather API (Optional)

If not configured, the system will use mock data.

### Option 1: Open-Meteo API (Free, no key needed)
```env
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
WEATHER_API_KEY=
WEATHER_API_NAME=open-meteo
```

### Option 2: OpenWeatherMap API (Currently Configured)
```env
WEATHER_API_KEY=d3f36f311e87f456b2c011ac4475c83a
# No need for WEATHER_API_URL - it's hardcoded to OpenWeatherMap
# The system automatically maps regions to cities:
# North -> Delhi, South -> Bangalore, East -> Kolkata, West -> Mumbai
```

## Google Cloud Vision (for PDF OCR)

```env
GOOGLE_APPLICATION_CREDENTIALS=./backend/google-vision-credentials.json
# Or use API key:
# GOOGLE_CLOUD_VISION_API_KEY=your-google-cloud-vision-api-key
```

## File Upload Configuration

```env
MAX_FILE_SIZE=10485760
# 10MB in bytes (default)
```

## Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Quick Setup

1. Copy the variables above to a `.env` file in the root directory
2. Fill in your actual API keys and credentials
3. **Required APIs:**
   - `GEMINI_API_KEY` - Required for AI features
   - `AIR_VISUAL_API_KEY` - Required for AQI data (no mock fallback)
   - `MONGODB_URI` - Required for database
4. **Optional APIs:**
   - `WEATHER_API_KEY` - Weather data (falls back to mock if not configured)

## Notes

- **Required APIs:** `GEMINI_API_KEY`, `AIR_VISUAL_API_KEY`, `MONGODB_URI`
- **Optional APIs:** `WEATHER_API_KEY` (falls back to mock data if not configured)
- AQI API is required - the system will throw errors if `AIR_VISUAL_API_KEY` is not configured
- Gemini API includes automatic retry logic with exponential backoff for rate limit errors (429)
- Default Gemini model is `gemini-1.5-flash` (higher quota) - can be changed via `GEMINI_MODEL` env var
- Environment variables are loaded from the root `.env` file
- Never commit your `.env` file to version control

