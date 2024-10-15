import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/header.css'; // Assurez-vous de créer un fichier CSS pour Home

const Header = () => {
  return (
    <header className="header">
      <div className="logo">OpenWeatherApi</div>
      <nav className="nav">
        <Link to="/"></Link>
        <Link to="/collaborer"></Link>
        <Link to="/decouvrir"></Link>
        <Link to="/contact"></Link>
      </nav>
    </header>
  );
};

export default Header;
