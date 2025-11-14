import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div className="space-y-4">
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800">{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              - {comment.author.username} on {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentList;