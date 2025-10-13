import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getCategories, createPost } from '../../api';

const PostCreate = () => {
  const [formData, setFormData]= useState({title: '', content: '', category_id: '', image: null});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    fetchCategories();
  },[]);

  const fetchCategories = async () =>{
    try{
       const response = await getCategories();
       setCategories(response.data);
    }catch(err){
      console.log('Error fetching categories');
    }
  }

  const handleChange = (e) =>{
    if(e.target.name =='image'){
      setFormData({ ...formData, image: e.target.files[0]});
    }else{
      setFormData({ ...formData, [e.target.name]: e.target.value})
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!formData.title || !formData.content || !formData.category_id ){
     setError('Please fill all required fields');
     return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category_id', formData.category_id);
    if(formData.image){
      data.append('image', formData.image);
    }

    try{
      await createPost(data);
      navigate('/posts')
    }catch(err){
      setError('Failed to create post');
    }

  }
  return (
    <div className='post-form-container'>
      <h2>Create Post</h2>
      <form className="post-form" encType="multipart/form-data" onSubmit={handleSubmit}>
        <input type="text" name='title' placeholder='Enter Post title' value={formData.title} onChange={handleChange} required />

        <textarea name="content" id="content" value={formData.content} onChange={handleChange} placeholder='Content' required></textarea>

        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat =>(
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input type="file" name='image' accept='image/*' onChange={handleChange} />
        <button type='submit'>Create Post</button>
      </form>
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default PostCreate
