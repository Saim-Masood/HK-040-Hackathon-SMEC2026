import { useState, useEffect } from 'react';
import { 
  Wind, 
  MapPin, 
  Search, 
  Loader2, 
  AlertCircle, 
  Navigation,
  Cloud,
  Sparkles,
  Info,
  ArrowRight,
  Gauge,
  Activity,
  Droplets,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  AQI_LEVELS, 
  POLLUTANT_THRESHOLDS, 
  getPollutantIndex, 
  getPollutantPercentage,
  POPULAR_CITIES 
} from '@/lib/aqiData';
import { getCoordinates, getAirPollution, getCityFromCoordinates, isApiKeyConfigured } from '@/services/api';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [airPollutionData, setAirPollutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  useEffect(() => {
    if (!isApiKeyConfigured()) {
      setShowApiDialog(true);
    }
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const results = await getCoordinates(searchQuery);
      if (results.length === 0) {
        setError('No locations found. Please try a different search term.');
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setError('Failed to search locations. Please check your API key and try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectLocation = async (location) => {
    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSearchQuery('');

    try {
      const data = await getAirPollution(location.lat, location.lon);
      setSelectedLocation({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      });
      setAirPollutionData(data);
    } catch (err) {
      setError('Failed to fetch air pollution data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [cityData, pollutionData] = await Promise.all([
            getCityFromCoordinates(latitude, longitude),
            getAirPollution(latitude, longitude)
          ]);
          
          setSelectedLocation({
            name: cityData?.name || 'Your Location',
            country: cityData?.country || '',
            state: cityData?.state,
            lat: latitude,
            lon: longitude
          });
          setAirPollutionData(pollutionData);
        } catch (err) {
          setError('Failed to fetch data for your location.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError('Unable to retrieve your location. Please enable location services or search for a city.');
      }
    );
  };

  const currentAQI = airPollutionData?.list?.[0]?.main?.aqi;
  const currentAQIInfo = currentAQI ? AQI_LEVELS[currentAQI] : null;
  const components = airPollutionData?.list?.[0]?.components;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background bg-pattern">
        {/* Floating particles background effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Wind className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Air Quality Monitor
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real-time air pollution monitoring based on your location. 
              Check the air quality index and pollutant concentrations instantly.
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4"
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="w-4 h-4 mr-2" />
              View AQI Classification Table
            </Button>
          </header>

          {/* Search Section */}
          <Card className="mb-8 glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Find Location
              </CardTitle>
              <CardDescription>
                Enter a city name or use your current location to check air quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search for a city (e.g., London, Tokyo, New York)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12"
                  />
                  {searchLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                  )}
                </div>
                <Button type="submit" disabled={searchLoading || !searchQuery.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </form>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-sm">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button 
                variant="outline" 
                onClick={handleUseCurrentLocation}
                disabled={loading}
                className="w-full mb-6"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Use My Current Location
              </Button>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Select a location:</p>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(result)}
                      className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left flex items-center gap-3 group"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="flex-1">
                        {result.name}
                        {result.state && <span className="text-muted-foreground">, {result.state}</span>}
                        <span className="text-muted-foreground"> - {result.country}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Cities */}
              <div>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Popular Cities
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.slice(0, 8).map((city) => (
                    <Button
                      key={city.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectLocation(city)}
                      className="text-xs"
                    >
                      {city.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="mb-8 border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="mb-8">
              <CardContent className="py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Cloud className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground">Fetching air quality data...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {!loading && selectedLocation && airPollutionData && currentAQIInfo && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Location Header */}
              <Card className="glass overflow-hidden">
                <div 
                  className="h-2 w-full"
                  style={{ backgroundColor: currentAQIInfo.color }}
                />
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {selectedLocation.name}
                          {selectedLocation.state && `, ${selectedLocation.state}`}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedLocation.country} • Lat: {selectedLocation.lat.toFixed(4)}, Lon: {selectedLocation.lon.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {new Date(airPollutionData.list[0].dt * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main AQI Display */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{ 
                      background: `radial-gradient(circle at 50% 50%, ${currentAQIInfo.color} 0%, transparent 70%)`
                    }}
                  />
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="w-32 h-32 rounded-full flex items-center justify-center mb-4 aqi-indicator"
                        style={{ 
                          backgroundColor: `${currentAQIInfo.color}20`,
                          border: `4px solid ${currentAQIInfo.color}`,
                          boxShadow: `0 0 40px ${currentAQIInfo.color}30`
                        }}
                      >
                        <div className="text-center">
                          <span 
                            className="text-4xl font-bold"
                            style={{ color: currentAQIInfo.color }}
                          >
                            {currentAQI}
                          </span>
                          <p className="text-xs text-muted-foreground">AQI</p>
                        </div>
                      </div>
                      <h3 
                        className="text-2xl font-bold mb-2"
                        style={{ color: currentAQIInfo.color }}
                      >
                        {currentAQIInfo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {currentAQIInfo.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* AQI Scale */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Gauge className="w-5 h-5 text-primary" />
                      Air Quality Scale
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(AQI_LEVELS).map(([index, level]) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                            currentAQI === parseInt(index) 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'opacity-60'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: level.color }}
                          >
                            {index}
                          </div>
                          <span className={`flex-1 ${currentAQI === parseInt(index) ? 'font-semibold' : ''}`}>
                            {level.name}
                          </span>
                          {currentAQI === parseInt(index) && (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                              Current
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pollutant Concentrations */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Pollutant Concentrations
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of individual pollutant levels (µg/m³)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(POLLUTANT_THRESHOLDS).map(([key, pollutant]) => {
                      const value = components?.[key] ?? 0;
                      const index = getPollutantIndex(key, value);
                      const percentage = getPollutantPercentage(key, value);
                      const levelInfo = AQI_LEVELS[index];

                      return (
                        <Tooltip key={key}>
                          <TooltipTrigger asChild>
                            <div className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all cursor-help group">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <PollutantIcon pollutant={key} className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{pollutant.name}</span>
                                </div>
                                <span 
                                  className="text-xs px-2 py-1 rounded-full font-medium"
                                  style={{ 
                                    backgroundColor: `${levelInfo.color}20`,
                                    color: levelInfo.color
                                  }}
                                >
                                  {levelInfo.name}
                                </span>
                              </div>
                              <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-2xl font-bold">{value.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">{pollutant.unit}</span>
                              </div>
                              <Progress 
                                value={percentage} 
                                className="h-2"
                                indicatorClassName="transition-all duration-500"
                                style={{ 
                                  '--progress-background': `${levelInfo.color}30`,
                                }}
                                indicatorStyle={{ backgroundColor: levelInfo.color }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-semibold">{pollutant.fullName}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Current level: {value.toFixed(2)} {pollutant.unit}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Health Recommendations */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Health Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealthRecommendations aqiLevel={currentAQI} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>Data provided by OpenWeatherMap Air Pollution API</p>
            <p className="mt-1">© 2026 Air Quality Monitor. All rights reserved.</p>
          </footer>
        </div>

        {/* API Key Dialog */}
        <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                API Key Required
              </DialogTitle>
              <DialogDescription>
                To use this application, you need to configure your OpenWeatherMap API key.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenWeatherMap API</a></li>
                <li>Sign up for a free account</li>
                <li>Generate an API key</li>
                <li>Replace <code className="px-1 py-0.5 rounded bg-secondary text-xs">YOUR_API_KEY_HERE</code> in <code className="px-1 py-0.5 rounded bg-secondary text-xs">src/services/api.js</code></li>
              </ol>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowApiDialog(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AQI Classification Dialog */}
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Air Quality Index Classification Table</DialogTitle>
              <DialogDescription>
                Pollutant concentration thresholds (all values in µg/m³)
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Quality</th>
                    <th className="text-center p-3 font-semibold">Index</th>
                    <th className="text-center p-3 font-semibold">SO₂</th>
                    <th className="text-center p-3 font-semibold">NO₂</th>
                    <th className="text-center p-3 font-semibold">PM₁₀</th>
                    <th className="text-center p-3 font-semibold">PM₂.₅</th>
                    <th className="text-center p-3 font-semibold">O₃</th>
                    <th className="text-center p-3 font-semibold">CO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="p-3"><span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span>Good</span></td>
                    <td className="text-center p-3">1</td>
                    <td className="text-center p-3">[0–20)</td>
                    <td className="text-center p-3">[0–40)</td>
                    <td className="text-center p-3">[0–20)</td>
                    <td className="text-center p-3">[0–10)</td>
                    <td className="text-center p-3">[0–60)</td>
                    <td className="text-center p-3">[0–4400)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3"><span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-lime-500"></span>Fair</span></td>
                    <td className="text-center p-3">2</td>
                    <td className="text-center p-3">[20–80)</td>
                    <td className="text-center p-3">[40–70)</td>
                    <td className="text-center p-3">[20–50)</td>
                    <td className="text-center p-3">[10–25)</td>
                    <td className="text-center p-3">[60–100)</td>
                    <td className="text-center p-3">[4400–9400)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3"><span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span>Moderate</span></td>
                    <td className="text-center p-3">3</td>
                    <td className="text-center p-3">[80–250)</td>
                    <td className="text-center p-3">[70–150)</td>
                    <td className="text-center p-3">[50–100)</td>
                    <td className="text-center p-3">[25–50)</td>
                    <td className="text-center p-3">[100–140)</td>
                    <td className="text-center p-3">[9400–12400)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-3"><span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span>Poor</span></td>
                    <td className="text-center p-3">4</td>
                    <td className="text-center p-3">[250–350)</td>
                    <td className="text-center p-3">[150–200)</td>
                    <td className="text-center p-3">[100–200)</td>
                    <td className="text-center p-3">[50–75)</td>
                    <td className="text-center p-3">[140–180)</td>
                    <td className="text-center p-3">[12400–15400)</td>
                  </tr>
                  <tr>
                    <td className="p-3"><span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span>Very Poor</span></td>
                    <td className="text-center p-3">5</td>
                    <td className="text-center p-3">≥350</td>
                    <td className="text-center p-3">≥200</td>
                    <td className="text-center p-3">≥200</td>
                    <td className="text-center p-3">≥75</td>
                    <td className="text-center p-3">≥180</td>
                    <td className="text-center p-3">≥15400</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowInfoDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

// Pollutant Icon Component
function PollutantIcon({ pollutant, className }) {
  const icons = {
    so2: Droplets,
    no2: Cloud,
    pm10: Wind,
    pm2_5: Activity,
    o3: Sparkles,
    co: Flame,
  };
  
  const Icon = icons[pollutant] || Activity;
  return <Icon className={className} />;
}

// Health Recommendations Component
function HealthRecommendations({ aqiLevel }) {
  const recommendations = {
    1: [
      'Air quality is ideal for outdoor activities',
      'Enjoy your day outdoors without concerns',
      'Perfect conditions for exercise and sports',
    ],
    2: [
      'Air quality is acceptable for most people',
      'Sensitive individuals should consider limiting prolonged outdoor exertion',
      'Good day for outdoor activities with minimal precautions',
    ],
    3: [
      'Sensitive groups should reduce prolonged outdoor exertion',
      'Consider moving activities indoors if you experience symptoms',
      'Keep windows closed during peak traffic hours',
    ],
    4: [
      'Everyone should limit prolonged outdoor exertion',
      'Sensitive groups should avoid outdoor activities',
      'Use air purifiers indoors if available',
      'Wear an N95 mask if outdoor activities are necessary',
    ],
    5: [
      'Avoid all outdoor physical activities',
      'Keep all windows and doors closed',
      'Use air purifiers on high settings',
      'Sensitive groups should consider relocating temporarily',
      'Seek medical attention if experiencing symptoms',
    ],
  };

  const tips = recommendations[aqiLevel] || recommendations[1];
  const levelInfo = AQI_LEVELS[aqiLevel];

  return (
    <div className="space-y-3">
      {tips.map((tip, index) => (
        <div 
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ backgroundColor: levelInfo?.color }}
          >
            {index + 1}
          </div>
          <p className="text-sm">{tip}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
