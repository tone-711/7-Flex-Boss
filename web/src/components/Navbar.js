import React from 'react';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { Link, useLocation } from "wouter";
import Toolbar from '@mui/material/Toolbar';

export default function Navbar() {
    const [location, navigate] = useLocation();

return (
    <AppBar position="static">
    <Toolbar style={{ background: "#FF9900" }}>
        <Box sx={{display:'flex'}}>
        <div style={{ marginRight: 20 }}>
            <Link to="/" style={{ color: 'white', fontSize: 18, padding: 20, margin: 20 }}>
                <a className="link" onClick={() => navigate('/')}>Shifts</a>
            </Link>
        </div>

        <div style={{ marginRight: 20 }}>
        <Link to="/CreateGig" style={{ color: 'white', fontSize: 18 }}>
        <a className="link" onClick={() => navigate('/creategig')}>Create Gig</a>
        </Link>
        </div>

        <div style={{ marginRight: 20 }}>
        <Link to="/Addlocation" style={{ color: 'white', fontSize: 18 }}>
        <a className="link" onClick={() => navigate('/addlocation')}>Add Location</a>
        </Link>
        </div>

        <div style={{ marginRight: 20 }}>
        <Link to="/RegisterEmployee" style={{ color: 'white', fontSize: 18 }}>
        <a className="link" onClick={() => navigate('/registeremployee')}>Register Employee</a>
        </Link>
        </div>

        {/*CLEAR USER TOKEN*/}
        <div style={{ marginRight: 20 }}>
        <Link to="/RegisterEmployee" style={{ color: 'white', fontSize: 18 }}>
        <a className="link" onClick={() => navigate('/registeremployee')}>Logout</a>
        </Link>
        </div>
        </Box>
    </Toolbar>
  </AppBar>
  );
}