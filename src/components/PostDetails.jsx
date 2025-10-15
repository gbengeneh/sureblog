import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPost } from '../../api';
import Comments from './Comments';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const userId = user?.id;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="post-detail">
      <h2>{post.title}</h2>
      {post.image && <img className="post-image" src={`http://localhost/phpclass/blog/uploads/${post.image.split('/').pop()}`} alt={post.title} onError={(e) => e.target.style.display = 'none'} />}
      <p>{post.content}</p>
      <p>Category: {post.category_name}</p>
      <div className="post-actions">
        {isAuthenticated && post.user_id == userId && <Link to={`/posts/${id}/edit`} className="edit-link">Edit</Link>}
        <Link to="/posts" className="back-link">Back to Posts</Link>
      </div>
      <Comments postId={id} />
    </div>
  );
};

export default PostDetail;
