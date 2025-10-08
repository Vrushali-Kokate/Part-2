import { useState, useEffect } from 'react';
import personService from './Persons';
import Notification from './Notification.jsx';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons));
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p =>
              p.id !== existingPerson.id ? p : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated number for ${returnedPerson.name}`, 'success');
          })
          .catch(error => {
            showNotification(`Info of '${existingPerson.name}' has already been removed from the server.`, 'error');
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });

        return;
      } else {
        return; // User cancelled
      }
    }

    // If person doesn't exist, create a new one
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => Number(p.id)))
      : 0;

    const newPerson = {
      id: maxId + 1,
      name: newName,
      number: newNumber
    };

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        showNotification(`Added ${returnedPerson.name}`, 'success');
      })
      .catch(error => {
        showNotification('Failed to add person', 'error');
      });
  };

  const handleDelete = id => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          showNotification(`Deleted ${person.name}`, 'success');
        })
        .catch(error => {
          showNotification(`Failed to delete ${person.name}. They may have already been removed.`, 'error');
        });
    }
  };

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
    <div className='success'>
      <h2>Phonebook</h2>

        {/* ✅ Notification rendered here */}
        <Notification message={notificationMessage} type={notificationType} />
      </div>

      <div>
        filter shown with: <input
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <h2>Add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input
            value={newName}
            onChange={event => setNewName(event.target.value)}
          />
        </div>
        <br />
        <div>
          number: <input
            value={newNumber}
            onChange={event => setNewNumber(event.target.value)}
          />
        </div>
        <br />
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
