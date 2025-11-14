import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
      <SignupForm />
    </div>
  );
};

export default Signup;