import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/api";

function Patrons() {
  const [patrons, setPatrons] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchPatrons();
  }, []);

  const fetchPatrons = async () => {
    const response = await axios.get(`${API}/patrons`);
    setPatrons(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/patrons`, form);
    fetchPatrons();
    setForm({
      first_name: "",
      last_name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/patrons/${id}`);
    fetchPatrons();
  };
  return (
    <div>
      <h1>Patrons</h1>

      <h2>Add New Patron</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />
        <input
          name="zip"
          placeholder="Zip"
          value={form.zip}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">Add Patron</button>
      </form>

      <h2>All Patrons</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patrons.map((patron) => (
            <tr key={patron.patron_id}>
              <td>{patron.patron_id}</td>
              <td>{patron.first_name}</td>
              <td>{patron.last_name}</td>
              <td>{patron.city}</td>
              <td>{patron.phone}</td>
              <td>{patron.email}</td>
              <td>
                <button onClick={() => handleDelete(patron.patron_id)}>
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

export default Patrons;
