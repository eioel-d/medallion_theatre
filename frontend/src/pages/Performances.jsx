import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/api";

function Performances() {
  const [performances, setPerformances] = useState([]);
  const [shows, setShows] = useState([]);
  const [form, setForm] = useState({
    production_id: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchPerformances();
    fetchShows();
  }, []);

  const fetchPerformances = async () => {
    const response = await axios.get(`${API}/performances`);
    setPerformances(response.data);
  };

  const fetchShows = async () => {
    const response = await axios.get(`${API}/shows`);
    setShows(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/performances`, form);
    fetchPerformances();
    setForm({ production_id: "", date: "", time: "" });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/performances/${id}`);
    fetchPerformances();
  };
  return (
    <div>
      <h1>Performances</h1>

      {/* Add Performance Form */}
      <h2>Add New Performance</h2>
      <form onSubmit={handleSubmit}>
        {/* Show dropdown - populated from database */}
        <select
          name="production_id"
          value={form.production_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Show</option>
          {shows.map((show) => (
            <option key={show.show_id} value={show.show_id}>
              {show.name}
            </option>
          ))}
        </select>

        {/* Date picker */}
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        {/* Matinee or Evening */}
        <select name="time" value={form.time} onChange={handleChange} required>
          <option value="">Select Time</option>
          <option value="matinee">Matinee</option>
          <option value="evening">Evening</option>
        </select>

        <button type="submit">Add Performance</button>
      </form>

      {/* Performances Table */}
      <h2>All Performances</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Show</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {performances.map((performance) => (
            <tr key={performance.performance_id}>
              <td>{performance.performance_id}</td>
              <td>{performance.show_name}</td>
              <td>{performance.date}</td>
              <td>{performance.time}</td>
              <td>
                <button
                  onClick={() => handleDelete(performance.performance_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Performances;
