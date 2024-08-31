import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

const DailyHabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "",
    frequency: "",
    tags: "",
  });
  const [editingHabit, setEditingHabit] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/habits", {
        withCredentials: true,
      });

      const data = response.data;
      setHabits(data);
      setFilteredHabits(data);
      const uniqueCategories = [
        ...new Set(data.map((habit) => habit.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterHabits(term, selectedCategory);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    filterHabits(searchTerm, value);
  };

  const filterHabits = (term, category) => {
    let filtered = habits;
    if (term) {
      filtered = filtered.filter(
        (habit) =>
          habit.name.toLowerCase().includes(term) ||
          habit.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }
    if (category) {
      filtered = filtered.filter((habit) => habit.category === category);
    }
    setFilteredHabits(filtered);
  };

  const addHabit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/habits",
        newHabit,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        fetchHabits();
        setNewHabit({ name: "", category: "", frequency: "", tags: "" });
      } else {
        console.error("Failed to add habit");
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const startEditingHabit = (habit) => {
    setEditingHabit({ ...habit, tags: habit.tags.join(", ") });
  };

  const updateHabit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/habits/${editingHabit._id}`,
        editingHabit,
        { withCredentials: true }
      );

      if (response.status === 200) {
        fetchHabits();
        setEditingHabit(null);
      } else {
        console.error("Failed to update habit");
      }
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/habits/${habitId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        fetchHabits();
      } else {
        console.error("Failed to delete habit");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const toggleHabitCompletion = async (habitId, completed) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/habits/${habitId}/progress`,
        {
          date: new Date().toISOString().split("T")[0],
          completed: !completed,
        },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        setHabits(habits.map(habit =>
          habit._id === habitId ? { ...habit, completed: !completed } : habit
        ));
        setFilteredHabits(filteredHabits.map(habit =>
          habit._id === habitId ? { ...habit, completed: !completed } : habit
        ));
      } else {
        console.error("Failed to update habit progress");
      }
    } catch (error) {
      console.error("Error updating habit progress:", error);
    }
  };
  
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Habit Tracker</h1>

      {/* Search and Category Filter */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Search habits..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow p-2 border rounded"
        />
        <select
          onChange={handleCategoryChange}
          className="p-2 border rounded"
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Habit */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Habit name"
          value={newHabit.name}
          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={newHabit.category}
          onChange={(e) =>
            setNewHabit({ ...newHabit, category: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Frequency"
          value={newHabit.frequency}
          onChange={(e) =>
            setNewHabit({ ...newHabit, frequency: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newHabit.tags}
          onChange={(e) => setNewHabit({ ...newHabit, tags: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addHabit}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Habit
        </button>
      </div>

      {/* Habit List */}
      {filteredHabits.length === 0 ? (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>No habits found. Try adjusting your search or add a new habit.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHabits.map((habit) => (
            <div key={habit._id} className="bg-white p-4 rounded-lg shadow">
              {editingHabit && editingHabit._id === habit._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingHabit.name}
                    onChange={(e) =>
                      setEditingHabit({ ...editingHabit, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={editingHabit.category}
                    onChange={(e) =>
                      setEditingHabit({
                        ...editingHabit,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={editingHabit.frequency}
                    onChange={(e) =>
                      setEditingHabit({
                        ...editingHabit,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={editingHabit.tags}
                    onChange={(e) =>
                      setEditingHabit({ ...editingHabit, tags: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={updateHabit}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingHabit(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{habit.name}</h3>
                    <p className="text-sm text-gray-500">{habit.category}</p>
                    <p className="text-sm text-gray-500">{habit.frequency}</p>
                    <div className="flex space-x-2 mt-1">
                      {habit.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditingHabit(habit)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 />
                    </button>
                    <button
                      onClick={() =>
                        toggleHabitCompletion(habit._id, habit.completed)
                      }
                      className={`p-2 rounded ${
                        habit.completed ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {habit.completed ? "Completed" : "Mark as Complete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyHabitTracker;
