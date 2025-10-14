import { useState, useEffect } from 'react';
import './index.css';
import CountryList from './components/CountryList';
import WeatherInfo from './components/WeatherInfo';

const OPENWEATHER_API_KEY = '2e867cd6ac6119c30f8a364ecd3cd9b8';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [error, setError] = useState(null);

  // Fetch countries when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setCountries([]);
      setSelectedCountry(null);
      setError(null);
      return;
    }

    fetch(`https://restcountries.com/v3.1/name/${query}`)
      .then(response => {
        if (!response.ok) throw new Error('Country not found');
        return response.json();
      })
      .then(data => {
        setCountries(data);
        setError(null);
        setSelectedCountry(null);
      })
      .catch(() => {
        setCountries([]);
        setError('Country not found');
        setSelectedCountry(null);
      });
  }, [query]);

  // Fetch weather when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry || !selectedCountry.capital?.[0]) {
      setWeather(null);
      setWeatherError(null);
      setWeatherLoading(false);
      return;
    }

    const capital = selectedCountry.capital[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    setWeatherLoading(true);
    setWeatherError(null);

    fetch(weatherUrl)
      .then(res => {
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
      })
      .then(data => {
        setWeather(data);
        setWeatherLoading(false);
      })
      .catch(() => {
        setWeather(null);
        setWeatherError('Could not fetch weather data');
        setWeatherLoading(false);
      });
  }, [selectedCountry]);

  const handleChange = (e) => setQuery(e.target.value);
  const handleShow = (country) => setSelectedCountry(country);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Country & Weather Info</h1>
      <div>
        Find countries: <input value={query} onChange={handleChange} />
      </div>

      {error && <div>{error}</div>}

      <CountryList
        countries={countries}
        selectedCountry={selectedCountry}
        onShow={handleShow}
        weather={weather}
        weatherLoading={weatherLoading}
        weatherError={weatherError}
      />
    </div>
  );
}

export default App;
