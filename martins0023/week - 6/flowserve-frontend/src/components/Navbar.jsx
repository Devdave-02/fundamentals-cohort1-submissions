import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        FlowServe
      </NavLink>
      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/transfer">New Transfer</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
