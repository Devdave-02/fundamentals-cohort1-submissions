import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    category: 'Web Development',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const projectData = {
        ...formData,
        techStack: formData.techStack.split(',').map(tech => tech.trim()),
      };
      const res = await api.post('/projects', projectData);
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Project Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" className="w-full p-2 border rounded"></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Tech Stack (comma separated)</label>
        <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g., React, Node.js, MongoDB" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
          <option>Web Development</option>
          <option>Mobile App</option>
          <option>AI/ML</option>
          <option>DevOps</option>
          <option>Data Science</option>
          <option>Other</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-600">
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm;