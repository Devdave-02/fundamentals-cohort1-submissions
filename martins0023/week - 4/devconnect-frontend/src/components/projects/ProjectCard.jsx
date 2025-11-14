import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-2 text-blue-600">{project.title}</h3>
      <p className="text-gray-500 mb-2">by {project.author.username}</p>
      <p className="text-gray-700 mb-4">{project.description.substring(0, 100)}...</p>
      <div className="mb-4">
        {project.techStack.map(tech => (
          <span key={tech} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {tech}
          </span>
        ))}
      </div>
      <Link to={`/projects/${project._id}`} className="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default ProjectCard;