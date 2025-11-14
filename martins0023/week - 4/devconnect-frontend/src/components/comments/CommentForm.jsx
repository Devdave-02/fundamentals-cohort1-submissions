import React, { useState } from 'react';
import api from '../../utils/api';

const CommentForm = ({ projectId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    try {
      const res = await api.post('/comments', { content, projectId });
      onCommentAdded(res.data);
      setContent('');
    } catch (err) {
      setError('Failed to post comment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white p-4 rounded-lg shadow">
      <h4 className="font-bold mb-2">Add a Comment</h4>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        required
        rows="3"
        className="w-full p-2 border rounded"
      ></textarea>
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default CommentForm;