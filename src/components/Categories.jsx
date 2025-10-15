import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleEdit = (category) => {
    setEditing(category.id);
    setEditName(category.name);
  };

  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, { name: editName });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="categories">
      <h2>Categories</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {editing === cat.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={() => handleUpdate(cat.id)}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                {cat.name}
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
