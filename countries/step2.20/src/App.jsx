import { useState, useEffect } from 'react';
import './index.css';

// Use the environment variable for the API key
const OPENWEATHER_API_KEY = '2e867cd6ac6119c30f8a364ecd3cd9b8';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [error, setError] = useState(null);

  // 1) Fetch countries when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setCountries([]);
      setSelectedCountry(null);
      setError(null);
      return;
    }

    fetch(`https://restcountries.com/v3.1/name/${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Country not found');
        }
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

  // 2) Fetch weather when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry || !selectedCountry.capital?.[0]) {
      setWeather(null);
      setWeatherError(null);
      setWeatherLoading(false);
      return;
    }

    const capital = selectedCountry.capital[0];

    setWeatherLoading(true);
    setWeatherError(null);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    fetch(weatherUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Weather fetch failed');
        }
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

  // Handle input change
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle show button click
  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  // Render country details + weather info
  const renderDetails = (country) => {
    return (
      <div style={{ marginTop: '20px' }}>
        <h2>{country.name.common}</h2>
        <p><strong>Capital:</strong> {country.capital?.join(', ') || 'N/A'}</p>
        <p><strong>Area:</strong> {country.area} km²</p>
        <h4>Languages:</h4>
        <ul>
          {Object.values(country.languages || {}).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img
          src={country.flags?.png}
          alt={`Flag of ${country.name.common}`}
          className="flag-img"
          style={{ border: '2px solid black', borderRadius: '4px', width: '200px' }}
        />

        {/* Weather Section */}
        {weatherLoading && <p>Loading weather...</p>}
        {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}

        {weather && !weatherLoading && !weatherError && (
          <div style={{ marginTop: '20px' }}>
            <h4>Weather in {country.capital[0]}</h4>
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
        )}
      </div>
    );
  };

  // Render country list or details
  const renderCountries = () => {
    if (error) {
      return <div>{error}</div>;
    }

    if (countries.length > 10) {
      return <div>Too many matches, specify another filter</div>;
    }

    if (selectedCountry) {
      return renderDetails(selectedCountry);
    }

    if (countries.length > 1) {
      return (
        <ul>
          {countries.map(country => (
            <li key={country.ccn3 || country.cca3}>
              {country.name.common}
              <button
                onClick={() => handleShow(country)}
                style={{ marginLeft: '10px' }}
              >
                Show
              </button>
            </li>
          ))}
        </ul>
      );
    }

    if (countries.length === 1) {
      return renderDetails(countries[0]);
    }

    return null;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Country & Weather Info</h1>
      <div>
        Find countries: <input value={query} onChange={handleChange} />
      </div>
      {renderCountries()}
    </div>
  );
}

export default App;
