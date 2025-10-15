import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

// Get all persons
const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

// Add a new person
const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data)
}

// Delete a person
const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, remove }
