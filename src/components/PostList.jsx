import React, { useEffect, useState } from 'react'
import { Link, Links } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getPosts, deletePost } from '../../api'


const PostList = () => {
    const [search, setSearch] = useState('')
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const {user, isAuthenticated} = useAuth();

    const userId = user ? user.id : null;

    useEffect(()=>{
        fetchPosts();
    },[]);
     
    useEffect(()=>{
      if(Array.isArray(posts)){
        setFilteredPosts(
            posts.filter(post => 
                post.title.toLowerCase().includes(search.toLowerCase()) || 
                post.content.toLowerCase().includes(search.toLowerCase())
            )
        );
    }
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
         className="search-input"
        type="text"
        placeholder="Search posts..."
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className='posts-grid'>
        {filteredPosts.map(post =>{
        return(
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              {post.image && <img src={`http://localhost/phpclass/blog/uploads/${post.image.split('/').pop()}`} alt={post.title} style={{ height: '200px', width: '100%'  }} onError={(e) => e.target.style.display= "none"} />}
              <p>{post.content.substring(0, 100)}...</p>
              <div className='post-buttons'>
                 <Link to={`/posts/${post.id}`} className='view-link'>View</Link>

                  {isAuthenticated && post.user_id == userId && <Link to={`/posts/${post.id}/edit`} className="edit-link">Edit</Link>}
                  
                {isAuthenticated && post.user_id == userId && <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>}
              </div>
            </div>
           )
        })
           
        }
        
      </div>
    </div>
  )
}

export default PostList
