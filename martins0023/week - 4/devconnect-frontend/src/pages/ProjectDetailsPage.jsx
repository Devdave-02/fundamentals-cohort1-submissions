import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ProjectDetail from '../components/projects/ProjectDetail';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import useAuth from '../hooks/useAuth';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectAndComments = async () => {
    try {
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data);
      const commentsRes = await api.get(`/comments/project/${id}`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjectAndComments();
  }, [id]);

  const addComment = (comment) => {
    // Optimistically update UI
    setComments(prevComments => [...prevComments, { ...comment, author: { username: user.username }}]);
  };

  if (loading) return <p className="text-center mt-10">Loading project details...</p>;
  if (!project) return <p className="text-center mt-10 text-red-500">Project not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <ProjectDetail project={project} />
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        <CommentList comments={comments} />
        {user && <CommentForm projectId={id} onCommentAdded={addComment} />}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;