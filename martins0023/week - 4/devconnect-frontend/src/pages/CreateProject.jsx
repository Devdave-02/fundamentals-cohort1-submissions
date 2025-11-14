import React from 'react';
import ProjectForm from '../components/projects/ProjectForm';

const CreateProject = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Share Your Project Idea</h2>
      <ProjectForm />
    </div>
  );
};

export default CreateProject;