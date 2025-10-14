import WeatherInfo from './WeatherInfo';

function CountryList({
  countries,
  selectedCountry,
  onShow,
  weather,
  weatherLoading,
  weatherError,
}) {
  if (!countries || countries.length === 0) return null;

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} weather={weather} weatherLoading={weatherLoading} weatherError={weatherError} />;
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} weather={weather} weatherLoading={weatherLoading} weatherError={weatherError} />;
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.ccn3 || country.cca3}>
          {country.name.common}
          <button
            onClick={() => onShow(country)}
            style={{ marginLeft: '10px' }}
          >
            Show
          </button>
        </li>
      ))}
    </ul>
  );
}

function CountryDetails({ country, weather, weatherLoading, weatherError }) {
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

      <WeatherInfo
        capital={country.capital?.[0]}
        weather={weather}
        loading={weatherLoading}
        error={weatherError}
      />
    </div>
  );
}

export default CountryList;
