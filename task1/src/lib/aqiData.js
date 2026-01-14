// AQI Classification based on the provided table
// All values in µg/m³

export const AQI_LEVELS = {
  1: { name: 'Good', color: '#22c55e', bgColor: 'bg-green-500', textColor: 'text-green-500', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  2: { name: 'Fair', color: '#84cc16', bgColor: 'bg-lime-500', textColor: 'text-lime-500', description: 'Air quality is acceptable. However, there may be a risk for some people.' },
  3: { name: 'Moderate', color: '#eab308', bgColor: 'bg-yellow-500', textColor: 'text-yellow-500', description: 'Members of sensitive groups may experience health effects.' },
  4: { name: 'Poor', color: '#f97316', bgColor: 'bg-orange-500', textColor: 'text-orange-500', description: 'Everyone may begin to experience health effects.' },
  5: { name: 'Very Poor', color: '#ef4444', bgColor: 'bg-red-500', textColor: 'text-red-500', description: 'Health warnings of emergency conditions. Everyone is more likely to be affected.' },
};

// Classification thresholds based on the provided table
export const POLLUTANT_THRESHOLDS = {
  so2: {
    name: 'SO₂',
    fullName: 'Sulfur Dioxide',
    unit: 'µg/m³',
    ranges: [
      { max: 20, index: 1 },
      { max: 80, index: 2 },
      { max: 250, index: 3 },
      { max: 350, index: 4 },
      { max: Infinity, index: 5 },
    ],
  },
  no2: {
    name: 'NO₂',
    fullName: 'Nitrogen Dioxide',
    unit: 'µg/m³',
    ranges: [
      { max: 40, index: 1 },
      { max: 70, index: 2 },
      { max: 150, index: 3 },
      { max: 200, index: 4 },
      { max: Infinity, index: 5 },
    ],
  },
  pm10: {
    name: 'PM₁₀',
    fullName: 'Particulate Matter (<10µm)',
    unit: 'µg/m³',
    ranges: [
      { max: 20, index: 1 },
      { max: 50, index: 2 },
      { max: 100, index: 3 },
      { max: 200, index: 4 },
      { max: Infinity, index: 5 },
    ],
  },
  pm2_5: {
    name: 'PM₂.₅',
    fullName: 'Fine Particulate Matter (<2.5µm)',
    unit: 'µg/m³',
    ranges: [
      { max: 10, index: 1 },
      { max: 25, index: 2 },
      { max: 50, index: 3 },
      { max: 75, index: 4 },
      { max: Infinity, index: 5 },
    ],
  },
  o3: {
    name: 'O₃',
    fullName: 'Ozone',
    unit: 'µg/m³',
    ranges: [
      { max: 60, index: 1 },
      { max: 100, index: 2 },
      { max: 140, index: 3 },
      { max: 180, index: 4 },
      { max: Infinity, index: 5 },
    ],
  },
  co: {
    name: 'CO',
    fullName: 'Carbon Monoxide',
    unit: 'µg/m³',
    ranges: [
      { max: 4400, index: 1 },
      { max: 9400, index: 2 },
      { max: 12400, index: 3 },
      { max: 15400, index: 4 },
      { max: Infinity, index: 5 },
    ],
  },
};

// Get AQI index for a specific pollutant value
export const getPollutantIndex = (pollutant, value) => {
  const thresholds = POLLUTANT_THRESHOLDS[pollutant];
  if (!thresholds) return 1;
  
  for (const range of thresholds.ranges) {
    if (value < range.max) {
      return range.index;
    }
  }
  return 5;
};

// Get the maximum percentage for progress bar based on pollutant
export const getPollutantPercentage = (pollutant, value) => {
  const thresholds = POLLUTANT_THRESHOLDS[pollutant];
  if (!thresholds) return 0;
  
  const maxValue = thresholds.ranges[4].max === Infinity 
    ? thresholds.ranges[3].max * 1.5 
    : thresholds.ranges[4].max;
  
  return Math.min((value / maxValue) * 100, 100);
};

// Popular cities for quick selection
export const POPULAR_CITIES = [
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
  { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074 },
  { name: 'Los Angeles', country: 'US', lat: 34.0522, lon: -118.2437 },
  { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
  { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333 },
];
