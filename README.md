# 🦆 HuntWindow AI

**AI-powered hunting forecasts combining real-time weather data and bird sighting intelligence**

HuntWindow AI is a Next.js application that generates intelligent hunting forecasts by analyzing weather patterns, eBird sighting data, and environmental conditions to help hunters plan their outings with data-driven insights.

## 🌐 Try it Live!

**🚀 [Launch HuntWindow AI](https://huntwindow-edgvhk8wp-jcars-projects.vercel.app)**

*Generate your first AI-powered hunting forecast in seconds! Just enter your ZIP code and select your target species.*

## ✨ Features

- **🤖 AI-Powered Forecasts**: GPT-powered analysis combining multiple data sources
- **🌤️ Weather Integration**: Real-time weather data and 7-day forecasts
- **🐦 eBird Integration**: Recent bird sighting data from the Cornell Lab of Ornithology
- **📍 Location-Based**: ZIP code lookup with precise geocoding
- **📱 Responsive Design**: Clean, mobile-friendly interface
- **📊 Forecast History**: Save and browse previous forecasts
- **🎯 Species Support**: Currently supports dove and duck hunting

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT API
- **External APIs**: 
  - eBird API (bird sightings)
  - Weather API (meteorological data)
  - Geocoding services

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- OpenAI API key
- eBird API key
- Weather API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd huntwindow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # eBird API
   EBIRD_API_KEY=your_ebird_api_key
   
   # Weather API
   WEATHER_API_KEY=your_weather_api_key
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Create a `forecasts` table in your Supabase database:
   ```sql
   CREATE TABLE forecasts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     species VARCHAR NOT NULL,
     zip VARCHAR NOT NULL,
     lat DECIMAL NOT NULL,
     lon DECIMAL NOT NULL,
     forecast TEXT NOT NULL,
     ebird_summary TEXT NOT NULL,
     weather_data JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Usage

1. **Create a Forecast**
   - Enter your ZIP code
   - Select target species (dove or duck)
   - Click "Generate Forecast"

2. **View Results**
   - AI-generated hunting forecast
   - Weather analysis
   - Recent bird sighting data
   - Recommendations and timing

3. **Browse History**
   - Visit `/forecasts` to see previous forecasts
   - Expand tiles to view full forecasts
   - See eBird sighting counts at a glance

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── forecasts/         # Forecast history page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ForecastListItem.tsx
│   ├── HuntForm.tsx
│   └── HuntResult.tsx
├── lib/                   # Utility libraries
│   ├── ebird.ts          # eBird API integration
│   ├── geocode.ts        # Location services
│   ├── moon.ts           # Moon phase calculations
│   ├── openai.ts         # AI forecast generation
│   ├── supabaseClient.ts # Database client
│   └── weather.ts        # Weather API integration
├── pages/api/            # API routes
│   ├── forecast.ts       # Generate new forecast
│   ├── forecasts.ts      # Fetch forecast history
│   └── weather.ts        # Weather data endpoint
└── types/                # TypeScript definitions
    └── index.ts
```

## 🔧 API Endpoints

- `GET /api/forecasts` - Retrieve forecast history
- `GET /api/forecast?species=dove&lat=40.7128&lon=-74.0060&zip=10001` - Generate new forecast
- `GET /api/weather?lat=40.7128&lon=-74.0060` - Get weather data

## 🚀 Deployment

This project is configured for automatic deployment to Vercel using GitHub Actions.

### Auto-Deploy Setup

1. **Fork this repository**
2. **Set up Vercel project**: `vercel link`
3. **Add GitHub repository secrets**:
   - `VERCEL_TOKEN` - Get from [Vercel tokens page](https://vercel.com/account/tokens)
   - `ORG_ID` - From `.vercel/project.json`
   - `PROJECT_ID` - From `.vercel/project.json`
4. **Configure environment variables** in Vercel dashboard
5. **Push to main branch** - automatic deployment will trigger

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI forecasts | Yes |
| `EBIRD_API_KEY` | eBird API key for sighting data | Yes |
| `WEATHER_API_KEY` | Weather service API key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cornell Lab of Ornithology](https://ebird.org) for eBird API
- [OpenAI](https://openai.com) for GPT API
- [Supabase](https://supabase.com) for database services
- Weather data providers

---

**Happy Hunting! 🎯**
