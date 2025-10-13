import React, { useState } from 'react'
import "../App.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
      const [menuOpen , setMenuOpen] = useState(false);
  return (
    <nav>
        <div className="nav-logo">
            <Link to="/">MyBlog</Link>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes/> : <FaBars/>}
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
            <Link to="/posts" onClick={()=>setMenuOpen(false)}>Posts</Link>
            <Link to="/categories" onClick={()=>setMenuOpen(false)}>Categories</Link>
            <AuthContext.Consumer>
                {({token, logout}) => (
                    token ? (
                        <>
                        <Link to="/create" onClick={()=>setMenuOpen(false)}>Create Post</Link>
                        <button onClick={() => {logout(); setMenuOpen(false);}}>Logout</button> 
                        </>
                    ) : (
                        <>
                           <Link to="/login" onClick={()=>setMenuOpen(false)}>Sign In</Link>
                            <Link to="/register" onClick={()=>setMenuOpen(false)}>Get Started</Link>
                        </>
                    )
                )}
            </AuthContext.Consumer>
        </div>
    </nav>
  )
}

export default Header
