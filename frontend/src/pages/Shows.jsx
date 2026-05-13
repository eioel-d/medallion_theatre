import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/api";

function Shows() {
  const [shows, setShows] = useState([])
  const [form, setForm] = useState({
    name: "",
    type: "",
  })

  useEffect(() => {
    fetchShows();
  }, [])

  const fetchShows = async () => {
    const response = await axios.get(`${API}/shows`)
    setShows(response.data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post(`${API}/shows`, form)
    fetchShows()
    setForm({ name: "", type: "" })
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/shows/${id}`)
    fetchShows()
  }
  return (
    <div>
      <h1>Shows</h1>

      {/* Add Show Form */}
      <h2>Add New Show</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Show Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="play">Play</option>
          <option value="concert">Concert</option>
        </select>
        <button type="submit">Add Show</button>
      </form>

      {/* Shows Table */}
      <h2>All Shows</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show.show_id}>
              <td>{show.show_id}</td>
              <td>{show.name}</td>
              <td>{show.type}</td>
              <td>
                <button onClick={() => handleDelete(show.show_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

}

export default Shows;
