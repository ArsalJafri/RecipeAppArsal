import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = ({ formType = "Register", onLogout }) => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    onLogout(); // Call the onLogout function to set the form to Register
    navigate("/auth");
  }; 

  return (
    <nav className="navbar">
      <div className="navbar-container">
      <Link to="/" className="nav-link">Home</Link>
        <Link to="/create-recipe" className="nav-link">Create Recipe</Link>
        {!cookies.access_token ? (
          <Link to="/auth" className="nav-link">{formType}</Link>
        ) : (
          <>
            <Link to="/saved-recipes" className="nav-link">Saved Recipes</Link>
            <Link onClick={logout} className="nav-link logout-button">Logout</Link>
          </>
        )}
      </div>
    </nav>
  );
};


