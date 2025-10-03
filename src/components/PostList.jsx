import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getPosts, deletePost } from '../../api'

const PostList = () => {
    const [search, setSearch] = useState('')
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const {user} = useAuth();

    const userId = user ? user.id : null;

    useEffect(()=>{
        fetchPosts();
    },[]);
     
    useEffect(()=>{
        setFilteredPosts(
            posts.filter(post => 
                post.title.toLowerCase().includes(search.toLowerCase()) || 
                post.content.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, posts]);

    const fetchPosts = async () => {
      try{
        setLoading(true);
        const response = await getPosts();
        setPosts(response.data);
      }catch(error){
        console.error("Error fetching posts:", error);
      }finally{
        setLoading(false);
      }
    }
   const handleDelete = async (id) => {
    if(window.confirm('are you sure you want to delete this Post? ')){
       try {
             await deletePost(id);
             setPosts(posts.filter(post => post.id !==id));
       }catch(error){
        console.error('Error deleting post:', error);
       }
    }
   }
  if(loading) return <p>Loading...</p>
  return (
    <div>
      <h2>Posts</h2>
      <input
        type="text"
        placeholder="Search posts..."
        value={() => ''} 
        // onChange={(e) => setSearch(e.target.value)}
      />
      <div className='posts-grid'>
        <div className='post-card'>
            <h3>Post Title</h3>
            <p>Post excerpt...</p>
            <Link to={`/`} className='view-link'>View</Link>
            <Link to={`/`} className='edit-link'>Edit</Link>
            <button className='delete-button'>Delete</button>
        </div>
        
      </div>
    </div>
  )
}

export default PostList
