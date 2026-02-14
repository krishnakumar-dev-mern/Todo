import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://192.168.1.5:5000/todos";

export default function App() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/items`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`${API}/items/${editId}`, formData);
      setEditId(null);
    } else {
      await axios.post(`${API}/items`, formData);
    }

    setFormData({ title: "", description: "" });
    setShowForm(false);
    fetchItems();
  };

  //Handle Edit
  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center mb-2">MERN DEV TODO APP</h1>
      <h2 className="text-lg text-center text-gray-600 mb-6">
        Todo Save Your Memories
      </h2>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-6 mb-8 items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>

        {/* Image Section */}
        <div className="bg-white rounded-xl shadow-md flex items-center justify-center ">
          <img
            src="night 1.jpg"
            alt="placeholder"
            className="rounded-xl h-59 w-full"
          />
        </div>
      </div>

      {/* Mobile Add Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white w-12 h-12 rounded-full text-2xl"
        >
          +
        </button>
      </div>

      {/* Mobile Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center md:hidden">
          <div className="bg-white p-6 rounded-xl w-11/12 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ❌
            </button>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Items List */}

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-xl shadow-md flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-600 text-sm wrap-break-word">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-400 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
