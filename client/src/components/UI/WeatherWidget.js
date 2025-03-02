import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';

const WeatherWidget = ({ weather }) => {
  const { temperature, humidity, condition, windSpeed } = weather;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      case 'snow':
      case 'snowy':
        return <CloudSnow className="h-12 w-12 text-blue-300" />;
      case 'stormy':
      case 'thunderstorm':
        return <CloudLightning className="h-12 w-12 text-purple-500" />;
      case 'windy':
        return <Wind className="h-12 w-12 text-blue-300" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {getWeatherIcon(condition)}
        <div className="ml-4">
          <div className="text-2xl font-bold">{temperature}°C</div>
          <div className="text-gray-500">{condition}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-gray-500">Humidity: {humidity}%</div>
        <div className="text-gray-500">Wind: {windSpeed} km/h</div>
      </div>
    </div>
  );
};

export default WeatherWidget;
