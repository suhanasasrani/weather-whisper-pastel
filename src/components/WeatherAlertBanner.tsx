import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/types/weather';

interface WeatherAlertBannerProps {
  weatherData: WeatherData;
}

export const WeatherAlertBanner = ({ weatherData }: WeatherAlertBannerProps) => {
  const { current } = weatherData;
  const weatherMain = current.weather[0]?.main.toLowerCase() || '';
  const temp = current.temp;
  const windSpeed = current.wind_speed;
  const humidity = current.humidity;
  
  const suggestions: { icon: string; message: string; severity: 'warning' | 'danger' | 'info' }[] = [];

  // Rain/Drizzle conditions
  if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
    suggestions.push({
      icon: '☔',
      message: 'Carry an umbrella and wear waterproof clothing',
      severity: 'warning'
    });
  }

  // Thunderstorm conditions
  if (weatherMain.includes('thunderstorm')) {
    suggestions.push({
      icon: '⛈️',
      message: 'Avoid outdoor activities. Stay indoors and away from windows',
      severity: 'danger'
    });
    suggestions.push({
      icon: '🚗',
      message: 'Avoid driving if possible. If you must, drive slowly',
      severity: 'danger'
    });
  }

  // Snow conditions
  if (weatherMain.includes('snow') || weatherMain.includes('blizzard')) {
    suggestions.push({
      icon: '❄️',
      message: 'Wear warm layers and carry gloves. Roads may be slippery',
      severity: 'warning'
    });
  }

  // Extreme cold
  if (temp < 0) {
    suggestions.push({
      icon: '🥶',
      message: 'Extremely cold! Wear multiple layers and limit time outdoors',
      severity: 'danger'
    });
  } else if (temp < 10) {
    suggestions.push({
      icon: '🧥',
      message: 'It\'s chilly! Wear a warm jacket',
      severity: 'info'
    });
  }

  // Extreme heat
  if (temp > 35) {
    suggestions.push({
      icon: '🥵',
      message: 'Extreme heat! Stay hydrated, wear light clothing, avoid sun exposure',
      severity: 'danger'
    });
  } else if (temp > 30) {
    suggestions.push({
      icon: '☀️',
      message: 'Hot weather! Drink plenty of water and wear sunscreen',
      severity: 'warning'
    });
  }

  // High winds
  if (windSpeed > 10) {
    suggestions.push({
      icon: '💨',
      message: 'Strong winds! Secure loose items and be careful while driving',
      severity: 'warning'
    });
  }

  // High humidity
  if (humidity > 85 && temp > 25) {
    suggestions.push({
      icon: '💧',
      message: 'High humidity! Take breaks in cool areas and stay hydrated',
      severity: 'info'
    });
  }

  // Fog/Mist conditions
  if (weatherMain.includes('fog') || weatherMain.includes('mist') || weatherMain.includes('haze')) {
    suggestions.push({
      icon: '🌫️',
      message: 'Low visibility! Drive carefully with headlights on',
      severity: 'warning'
    });
  }

  // High UV index
  if (current.uvi && current.uvi > 7) {
    suggestions.push({
      icon: '🕶️',
      message: 'High UV! Wear sunglasses and apply SPF 30+ sunscreen',
      severity: 'warning'
    });
  }

  // Official alerts from API
  if (weatherData.alerts && weatherData.alerts.length > 0) {
    weatherData.alerts.forEach(alert => {
      suggestions.push({
        icon: '⚠️',
        message: `${alert.event}: ${alert.description.slice(0, 100)}...`,
        severity: 'danger'
      });
    });
  }

  // If no concerns, show all-clear message
  if (suggestions.length === 0) {
    return (
      <Alert className="glass-card border-green-500/30 bg-green-500/10">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <AlertTitle className="text-green-600 dark:text-green-400 font-semibold">
              Perfect Weather!
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              No weather concerns. Enjoy your day! 🌈
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'border-destructive/30 bg-destructive/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-primary/30 bg-primary/10';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'danger':
        return <Badge variant="destructive">Action Required</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Caution</Badge>;
      default:
        return <Badge variant="secondary">Tip</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xl">🔔</span>
        <h3 className="font-semibold text-foreground">Weather Advisory</h3>
        <Badge variant="outline">{suggestions.length} {suggestions.length === 1 ? 'alert' : 'alerts'}</Badge>
      </div>
      
      {suggestions.map((suggestion, index) => (
        <Alert 
          key={index} 
          className={`glass-card ${getSeverityStyles(suggestion.severity)} animate-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl flex-shrink-0">{suggestion.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                {getSeverityBadge(suggestion.severity)}
              </div>
              <AlertDescription className="text-foreground font-medium">
                {suggestion.message}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};
