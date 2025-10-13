import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost, getCategories } from '../../api';

const PostEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '', category_id: '', image: null });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        category_id: response.data.category_id,
        image: null // Keep null, user can upload new
      });
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category_id) {
      setError('Please fill all required fields');
      return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category_id', formData.category_id);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await updatePost(id, data);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError('Failed to update post');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="post-form-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="post-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Update Post</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PostEdit;
