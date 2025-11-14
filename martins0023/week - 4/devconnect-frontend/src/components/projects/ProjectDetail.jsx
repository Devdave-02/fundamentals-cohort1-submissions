import React from 'react';

const ProjectDetail = ({ project }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.title}</h1>
      <p className="text-gray-500 mb-6">Posted by <span className="font-semibold">{project.author.username}</span></p>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map(tech => (
            <span key={tech} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div>
         <h3 className="text-xl font-semibold mb-2">Category</h3>
         <p className="text-gray-700">{project.category}</p>
      </div>
    </div>
  );
};

export default ProjectDetail;