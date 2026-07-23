 import { NextResponse } from 'next/server';
 import { GoogleGenAI } from '@google/genai';

 const ai = new GoogleGenAI ({apiKey: process.env.GEMINI_API_KEY});

//Sending request to get the latitude and longitude of the destination.
 async function getCoordinates(destination) {

const geoRes = await fetch (
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`
); 

const geoData = await geoRes.json(); 

if (!geoData.results || geoData.results.length === 0) {
throw new error(`could not found this location ${destination}`) 
} 

const {latitude, longitude, name, country} = geoData.results[0];  

return {latitude, longitude, name, country};  

}  

async function getWheather(latitude, longitude) {

const weatherRes = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`);

const weatherFetch = await weatherRes.json();

return weatherFetch.daily;
  
};

//Getting the value(request) parameter and from the POST method (next.js)
export async function POST(request) {

try {

//parsing the JSON string from the frontend. 
    const body = await request.json();  

//using destructuring
    const { destination, days, budget, origin } = body; 

//Get real coordinates + weather before building the prompt 

const location = await getCoordinates (destination);

const weather = await getWheather(location.latitude, location.longitude);

//Gettting the value readable 

const numDays = Math.min(Number(days), weather.time.length);
const weatherSummary = weather.time
.slice(0, numDays)
.map((date, i) => `${date}: High ${weather.temperature_2m_max[i]}°C, Low ${weather.temperature_2m_min[i]}°C, Rain chance ${weather.precipitation_probability_max[i]}%`)
.join('\n');

//The promt which we are sending to Gemini.  

const promptMessage =  `
      You are a brilliant local travel planner. Create an incredibly helpful, highly customized ${days}-day itinerary for a trip from ${origin} to ${destination}.
      Include practical advice on how to travel from ${origin} to ${destination} (e.g. flight, train, or road options) as part of your response.
      The budget target is specifically ${budget}.

      Here is the actual weather forecast for the trip dates:
      ${weatherSummary}
      Use this real weather data to tailor your suggestions — recommend indoor activities on days with high rain chance, and outdoor/beach activities on clear days.

      Break your response down day-by-day. For each day, suggest specific landmarks, great local dishes to try, and practical transport or scheduling tips.
      For each day, also include an estimated cost breakdown in local currency and approximate USD — covering accommodation, food, activities, and local transport — clearly labeled as "Estimated Daily Cost."
      At the very end, provide a "Total Estimated Trip Cost" summing up all days.
      Keep formatting scannable and organized, using clear headings for each day.
    `;

//Sending the promt to the google GRMINI using Google SDK.  
const response = await ai.models.generateContent({   
    model: 'gemini-flash-latest',   
    contents: promptMessage, 
    }); 
                 
    return NextResponse.json({success: true, 
        plan: response.text,
        weather,
        location,
    }); 

    } 
    catch (error) {  
        console.error("Backend API logs:", error);
            return NextResponse.json({success: false, error: error.message}, {status: 500});
    }  
}
