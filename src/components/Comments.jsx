import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getComments, createComment } from '../../api';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({ post_id: postId, content: newComment });
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error('Error creating comment:', err);
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
      {token ? (
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
