import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getComments, createComment } from '../../api';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  console.log('Comments: received postId =', postId, 'type =', typeof postId);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      console.log('Comments: Fetching comments for postId:', postId);
      const response = await getComments(postId);
      console.log('Comments: API response data:', response.data);
      // Filter comments to only include those for the specific postId
      const filteredComments = response.data.filter(comment => String(comment.post_id) === String(postId));
      console.log('Comments: Filtered comments:', filteredComments);
      setComments(filteredComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      if (err.response && err.response.status === 401) {
        // Token might be invalid or expired, logout
        logout();
        alert('Your session has expired. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Comments: Submitting comment:', { post_id: postId, content: newComment });
      await createComment({ post_id: postId, content: newComment });
      console.log('Comments: Comment submitted successfully');
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Error creating comment:', err);
      if (err.response && err.response.status === 401) {
        // Token might be invalid or expired, logout
        logout();
        alert('Your session has expired. Please log in again.');
      }
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="comments">
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} className="comment">
            <p>{comment.content}</p>
            <small>By: {comment.username} on {new Date(comment.created_at).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p><Link to="/login">Login to add a comment</Link></p>
      )}
    </div>
  );
};

export default Comments;
