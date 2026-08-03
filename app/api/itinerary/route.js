import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { destination, days, budget, origin } = await request.json();

    // 1. Geocode Destination
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ success: false, error: "Destination not found. Please check your spelling." }, { status: 404 });
    }
    const loc = geoData.results[0];

    // 2. Fetch Weather (ADDED precipitation_probability_max and timezone)
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=${days}`);
    const weatherData = await weatherRes.json();

        // 3. TEMPORARY MOCK DATA (Bypassing Gemini Error)

    const mockPlan = `## Trip Overview: ${origin} ✈️ ${destination}
**Duration:** ${days} Days | **Budget:** ${budget.toUpperCase()}

---

## Day 1: Arrival & Exploration
**Morning**
* Depart from **${origin}** and arrive in beautiful **${destination}**.
* Check into your ${budget}-friendly accommodation in the city center.
* Grab a quick coffee and pastry at a highly-rated local cafe.

**Afternoon**
* Take a guided walking tour of the main historical district to get your bearings.
* Visit the most iconic landmark in ${destination}.

**Evening**
* Enjoy a welcome dinner featuring local cuisine (perfect for a ${budget} budget).
* Take a leisurely evening stroll to soak in the atmosphere.

## Day 2: Deep Dive into Culture
**Morning**
* Breakfast at the hotel or a nearby bakery.
* Visit the premier museum or art gallery in the city.

**Afternoon**
* Enjoy a street food lunch or casual dining experience.
* Explore a vibrant local market and pick up some souvenirs to take back to **${origin}**.

**Evening**
* Try a different culinary neighborhood for dinner.
* Experience the local nightlife or attend a cultural performance.

**💡 Local Pro-Tip:** The weather in ${destination} can be unpredictable, so keep an eye on the forecast above and pack layers! Safe travels back to ${origin} at the end of your trip!`;
    
    return NextResponse.json({
      success: true,
      plan: mockPlan,
      location: loc,
      weather: weatherData.daily
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}