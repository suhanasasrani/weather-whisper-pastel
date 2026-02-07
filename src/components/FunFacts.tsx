import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData, HistoricalWeather } from '@/types/weather';
import { generateFunFact } from '@/utils/weatherUtils';

interface FunFactsProps {
  weatherData: WeatherData;
  historicalData: HistoricalWeather[];
}

export const FunFacts = ({ weatherData, historicalData }: FunFactsProps) => {
  const currentWeather = weatherData.current.weather[0];
  const funFact = generateFunFact(currentWeather.main, weatherData.current.temp);
  
  const weatherTrivia = [
    {
      icon: '🌡️',
      title: 'Temperature Record',
      description: `Today's ${weatherData.current.temp.toFixed(1)}°C feels like ${weatherData.current.feels_like.toFixed(1)}°C`,
      detail: 'The "feels like" temperature accounts for wind chill and humidity'
    },
    {
      icon: '💨',
      title: 'Wind Power',
      description: `Current wind speed: ${weatherData.current.wind_speed.toFixed(1)} m/s`,
      detail: 'That\'s equivalent to a gentle breeze on the Beaufort scale'
    },
    {
      icon: '💧',
      title: 'Humidity Level',
      description: `Air moisture: ${weatherData.current.humidity}%`,
      detail: 'Optimal comfort zone is typically between 30-50% humidity'
    },
    {
      icon: '☀️',
      title: 'UV Index',
      description: `UV intensity: ${weatherData.current.uvi?.toFixed(1) || 'N/A'}`,
      detail: 'UV index helps determine sun protection needs'
    }
  ];

  const todayDate = new Date();
  const dayOfYear = Math.floor(
    (todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const weatherFacts = [
    `Today is the ${dayOfYear}th day of ${todayDate.getFullYear()} 📅`,
    'Weather patterns can affect our mood and energy levels 🧠',
    'The atmosphere contains about 78% nitrogen and 21% oxygen 🌍',
    'A cloud can weigh more than a million pounds! ☁️',
    'Lightning strikes the Earth about 100 times per second ⚡',
    'Rainbows appear when sunlight and rain occur at the same time 🌈'
  ];

  const randomFact = weatherFacts[Math.floor(Math.random() * weatherFacts.length)];

  return (
    <div className="space-y-6">
      {/* Daily Fun Fact */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🎉</span>
            <span>Today's Weather Story</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-lg font-medium text-primary">
              {funFact}
            </div>
            <Badge variant="secondary" className="animate-pulse-slow">
              Generated just for you! ✨
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Historical Comparison */}
      {historicalData.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📚</span>
              <span>Weather Memory Lane</span>
            </CardTitle>
            <CardDescription>
              How today compares to previous years
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {historicalData.map((historical, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <div className="font-medium">{historical.date}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {historical.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {historical.temp.toFixed(1)}°C
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {historical.year}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              <span>📊 Weather patterns help us appreciate nature's cycles</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Trivia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weatherTrivia.map((trivia, index) => (
          <Card
            key={index}
            className="glass-card hover:scale-105 transition-transform duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{trivia.icon}</div>
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{trivia.title}</div>
                  <div className="text-primary font-medium">
                    {trivia.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trivia.detail}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Random Weather Fact */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🧠</div>
            <div>
              <div className="font-medium text-sm text-muted-foreground mb-1">
                Did You Know?
              </div>
              <div className="text-primary">
                {randomFact}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
