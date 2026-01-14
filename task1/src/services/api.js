// OpenWeatherMap API Service
// You need to replace this with your own API key from https://openweathermap.org/api

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''; // Use environment variable for API key
const BASE_URL = 'https://api.openweathermap.org';

// Geocoding API to get coordinates from city name
export const getCoordinates = async (cityName) => {
  if (!API_KEY) {
    throw new Error('API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`
    );
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your VITE_OPENWEATHER_API_KEY in .env file');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coordinates: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Air Pollution API
export const getAirPollution = async (lat, lon) => {
  if (!API_KEY) {
    throw new Error('API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your VITE_OPENWEATHER_API_KEY in .env file');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch air pollution data: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Air pollution API error:', error);
    throw error;
  }
};

// Reverse geocoding to get city name from coordinates
export const getCityFromCoordinates = async (lat, lon) => {
  if (!API_KEY) {
    throw new Error('API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your VITE_OPENWEATHER_API_KEY in .env file');
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch city name: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

// Check if API key is configured
export const isApiKeyConfigured = () => {
  return API_KEY && API_KEY.length > 0;
};
