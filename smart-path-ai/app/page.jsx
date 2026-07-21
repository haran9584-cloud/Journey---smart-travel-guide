'use client'

import { useState } from 'react';

export default function Home() {

  const [from, SetFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [budget, setBudget] = useState('mid-range');
  
  //States from server response and loading state

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(''); 
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const isDisabled = loading || !destination;

const handleGenerate =  async (e) => {
  e.preventDefault();
setLoading(true);
setResult('');

try {
const response = await fetch('/api/itinerary', {
  method: 'POST',
  headers: {'Content-type' : 'application/json' } ,
  body: JSON.stringify({destination, days, budget, from}),
});

const data = await response.json();
if (data.success) {
  setResult(data.plan);
  setLocation(data.location);
setWeather(data.weather);

}
else {
  setResult('Failed to connect to the server!');
}  
} catch (error) {
  setResult('Something went wrong generating your trip');
}

finally {
  setLoading(false);
 
}
 
}

return (

  <main style={{padding: '40px', maxWidth: '500px', margin: 'auto'}}>
    <style>{
        `@keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }`
      }</style>

<h1>Journey</h1>

<form onSubmit={handleGenerate}>

<div>
  <label style={{display: 'block', fontWeight: 'bold'}}>where are you from</label>
  <input
  type="text"
  placeholder="e.g. Chennai, Mumbai, Delhi"
  style={{ width: '100%', padding: '10px', marginBottom: '10px', marginTop: '5px', fontSize: '16px' }}
  value={from}
  onChange={(e) => SetFrom(e.target.value)}
/>
</div>

<div>
  <label style={{display: 'block', fontWeight: 'bold'}}>where are you going</label>
  <input
  type="text"
  placeholder="e.g. Paris, Goa, Tokyo"
  style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '16px' }}
  value={destination}
  onChange={(e) => setDestination(e.target.value)}
/>
</div>

<div style={{marginTop: '20px'}}>
  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Number of Days</label>
<input
  type="numnber"
  min="3"
  max="14"
  style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '16px' }}
  value={days}
  onChange={(e) => setDays(e.target.value)}
  required
/>
</div>

<div style={{marginTop: '20px'}}>
  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }} >Budget Preference</label>
  <select style= {{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff' }}
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
  required
  >
    <option value="back-packer">Backpaker / budget</option>
    <option value="mid-range">Mid-Range / Comfort</option>
    <option value="luxury"> Luxury / Premium</option>
  </select>
</div>

<button
type="submit"
style={{   
            padding: '12px',
            marginTop: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: isDisabled ? '#ccc' : '#0070f3',
            border: 'none',
            borderRadius: '5px',
            cursor: isDisabled ? 'not-allowed' : 'pointer'
          }}
>

  {loading && <span className ='spinner'></span>}
{loading ? 'Planning your trip....' : 'Plan My Trip'}
</button>   
</form>   

{result && (   
  <div
  style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          borderLeft: '5px solid #0070f3',
          whiteSpace: 'pre-line',
          lineHeight: '1.6'
        }}
  >
    <h1 style={{ marginTop: '0', color: '#0070f3' }}>
      Your travel Plan
    </h1>
    <p>{result}</p>
  </div>
)}

{weather && (
  <div style={{ marginTop: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
    {weather.time.slice(0, Number(days)).map((date, i) => (
      <div key={date} style={{padding: '10px',
          backgroundColor: '#eef6ff',
          borderRadius: '8px',
          minWidth: '90px',
          textAlign: 'center',
          flexShrink: 0}}>
        <div style={{fontSize: '12px', color: '#666'}}>{date.slice(5)}</div>
        <div style={{fontWeight: 'bold', margin: '4px 0'}}>{weather.temperature_2m_max[i]}° / {weather.temperature_2m_min[i]}°</div>
        <div style={{fontSize: '12px'}}>☔ {weather.precipitation_probability_max[i]}%</div> 
      </div>
    ))};
  </div>
)}

{location && (
<div style={{marginTop: '20px'}}>
  <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{location.name}</h3>
  <iframe 
  title="descination map"
src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.1},${location.latitude - 0.1},${location.longitude + 0.1},${location.latitude + 0.1}&marker=${location.latitude},${location.longitude}`}
  style={{width: '100%', height: '300px', border: '1px solid #ccc', borderRadius: '8px'}}
  />
</div>

)}

  </main>

)

}

