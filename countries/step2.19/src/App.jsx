import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch countries whenever query changes
  useEffect(() => {
    if (query.trim() === '') {
      setCountries([]);
      setError(null);
      setSelectedCountry(null);
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

  // Handle input change
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle show button
  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  // Render country details
  const renderDetails = (country) => (
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
        style={{ border: '2px solid black', borderRadius: '4px', width: '200px' }}
      />
    </div>
  );

  // Render countries list or details
  const renderCountries = () => {
    if (error) return <div>{error}</div>;

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
      <h1>Country Information</h1>
      <div>
        Find countries: <input value={query} onChange={handleChange} />
      </div>
      {renderCountries()}
    </div>
  );
}

export default App;
