import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { WeatherAlert } from '@/types/weather';
import { formatTime } from '@/utils/weatherUtils';

interface HazardAlertsProps {
  alerts: WeatherAlert[];
}

export const HazardAlerts = ({ alerts }: HazardAlertsProps) => {
  if (!alerts || alerts.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <span>✅</span>
            <span>All Clear</span>
          </CardTitle>
          <CardDescription>
            No weather warnings or alerts in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>🌈</span>
            <span>Perfect weather conditions - enjoy your day!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAlertIcon = (event: string) => {
    const eventLower = event.toLowerCase();
    if (eventLower.includes('thunder') || eventLower.includes('storm')) return '⛈️';
    if (eventLower.includes('rain') || eventLower.includes('flood')) return '🌧️';
    if (eventLower.includes('wind') || eventLower.includes('gale')) return '💨';
    if (eventLower.includes('snow') || eventLower.includes('blizzard')) return '❄️';
    if (eventLower.includes('heat')) return '🌡️';
    if (eventLower.includes('fog')) return '🌫️';
    return '⚠️';
  };

  const getAlertSeverity = (event: string) => {
    const eventLower = event.toLowerCase();
    if (eventLower.includes('warning') || eventLower.includes('severe')) return 'destructive';
    if (eventLower.includes('watch') || eventLower.includes('advisory')) return 'secondary';
    return 'outline';
  };

  const formatDuration = (start: number, end: number) => {
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    const duration = Math.round((end - start) / 3600);
    return `${startTime} - ${endTime} (${duration}h)`;
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <span>⚠️</span>
            <span>Weather Alerts</span>
            <Badge variant="destructive">{alerts.length}</Badge>
          </CardTitle>
          <CardDescription>
            Active weather warnings in your area
          </CardDescription>
        </CardHeader>
      </Card>

      {alerts.map((alert, index) => (
        <Alert key={index} className="glass-card animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="text-2xl">{getAlertIcon(alert.event)}</div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <AlertTitle className="text-lg font-bold">
                  {alert.event}
                </AlertTitle>
                <Badge variant={getAlertSeverity(alert.event) as any}>
                  {alert.sender_name}
                </Badge>
              </div>
              
              <AlertDescription className="text-foreground">
                {alert.description}
              </AlertDescription>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span className="text-muted-foreground">Active:</span>
                  <span className="font-medium">
                    {formatDuration(alert.start, alert.end)}
                  </span>
                </div>
                
                {alert.tags && alert.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span>🏷️</span>
                    <span className="text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {alert.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <span>💡</span>
                  <span className="font-medium">Safety Recommendations:</span>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Stay indoors and avoid unnecessary travel</li>
                  <li>Keep emergency supplies readily available</li>
                  <li>Monitor local news for updates</li>
                  <li>Avoid outdoor activities during the alert period</li>
                </ul>
              </div>
            </div>
          </div>
        </Alert>
      ))}
      
      <div className="text-center text-sm text-muted-foreground">
        <p>💙 Stay safe and check back for updates</p>
      </div>
    </div>
  );
};
