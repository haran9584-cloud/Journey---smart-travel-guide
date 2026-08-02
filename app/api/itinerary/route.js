import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    // 3. Generate Itinerary
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `You are a world-class travel planner and local expert. 
    Create a highly engaging, realistic ${days}-day itinerary for a trip from ${origin} to ${destination}.

    CRITICAL CONSTRAINTS:
    1. Budget: ${budget}. Strictly tailor all restaurant, transport, and activity recommendations to fit this specific budget level.
    2. Weather: The local forecast during this trip is ${JSON.stringify(weatherData.daily)}. You MUST adapt the activities based on this weather (e.g., prioritize indoor activities/museums if temperatures are extreme or raining; maximize outdoor time on mild, sunny days).

    FORMATTING REQUIREMENTS:
    - Use clean Markdown format.
    - Start each day with a descriptive header (e.g., "## Day 1: Exploring the Historic Heart").
    - Break each day into **Morning**, **Afternoon**, and **Evening** using bold text and bullet points (*).
    - Provide specific, actionable recommendations (name actual places, neighborhoods, or local dishes to try).
    - Include one short "**💡 Local Pro-Tip:**" at the end of each day.
    
    Keep the tone exciting, inspiring, and concise without unnecessary fluff. Do not wrap the response in a markdown code block.`;

    const result = await model.generateContent(prompt);
    
    return NextResponse.json({
      success: true,
      plan: result.response.text(),
      location: loc,
      weather: weatherData.daily
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}