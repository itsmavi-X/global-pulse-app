# Global Pulse: Real-Time Mental Health & Sentiment Tracker

Global Pulse is a cutting-edge web application that provides a dynamic, real-time visualization of global sentiment and mental health trends. By leveraging generative AI, it analyzes social media data to offer insights into the collective emotional state of different regions around the world.

## Features

- **Interactive Globe Visualization**: An interactive map (powered by Google Maps) displays sentiment data for various regions, color-coded for positive, negative, or neutral moods.
- **AI-Powered Post Analysis**: Users can input any text (like a social media post) and receive a detailed analysis, including the post's topic, sentiment, emotional intensity, geographic origin, and its contribution to the global "zeitgeist."
- **Real-Time Sentiment Data**: The map markers represent the current emotional trend in different countries, based on mock real-time data.
- **Dynamic Filtering**: The globe can be filtered to show only regions with positive, negative, or neutral sentiment.
- **Daily Emotional Digest**: For each region, the application provides a concise, AI-generated summary of the key emotional drivers and topics.
- **Emerging Trend Highlighting**: The dashboard highlights significant, newly emerging global trends, such as shifts in climate anxiety or economic optimism.

## Tech Stack

This project is built with a modern, production-ready technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Mapping**: [Google Maps Platform](https://developers.google.com/maps)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

Follow these steps to get the application running on your local machine.

### 1. Install Dependencies

First, install the necessary npm packages:

```bash
npm install
```

### 2. Set Up Environment Variables

You will need API keys for Google Maps and the Gemini AI model.

1.  Create a new file named `.env.local` in the root of your project.
2.  Add the following keys to the file:

    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

#### Acquiring API Keys:

-   **Google Maps API Key**:
    1.  Go to the [Google Cloud Credentials page](https://console.cloud.google.com/apis/credentials).
    2.  Create a new API key.
    3.  **Important**: You must enable the **Maps JavaScript API** and the **Geocoding API** for your project and link a **billing account**.

-   **Gemini API Key**:
    1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to generate your API key for the Gemini model.

### 3. Run the Development Server

Once the dependencies are installed and your environment variables are set, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. The application will automatically reload as you make changes.
