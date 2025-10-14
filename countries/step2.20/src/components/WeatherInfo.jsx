function WeatherInfo({ capital, weather, loading, error }) {
  if (loading) return <p>Loading weather...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!weather) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>Weather in {capital}</h4>
      <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
      <p><strong>Weather:</strong> {weather.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        className="weather-icon"
        style={{ width: '80px', height: '80px' }}
      />
      <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherInfo;
