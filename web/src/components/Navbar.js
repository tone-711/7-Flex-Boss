import { Box } from '@mui/material';
import React, { useContext } from "react";
import AppBar from '@mui/material/AppBar';
import { Link, useLocation } from "wouter";
import Toolbar from '@mui/material/Toolbar';
import { MemoContext } from "../services/MainMemo";

export default function Navbar() {
    const [location, navigate] = useLocation();
    const {setToken} = useContext(MemoContext);

    const logout = () => {
        window.sessionStorage.token=null
        setToken(null)
        navigate('/')
    }

return (
    <AppBar position="static">
    <Toolbar style={{ background: "#FF9900" }}>
        <Box sx={{display:'flex'}}>
        <div style={{ marginRight: 20 }}>
            <Link to="/">
                <a className="link" onClick={() => navigate('/')} style={{ color: 'black', fontWeight: 'bold' }}>Shifts</a>
            </Link>
        </div>

        <div style={{ marginRight: 20 }}>
        <Link to="/Addlocation">
        <a className="link" onClick={() => navigate('/addlocation')} style={{ color: 'black', fontWeight: 'bold' }}>Add Location</a>
        </Link>
        </div>

        <div style={{ marginRight: 20 }}>
        <Link to="/CreateGig">
        <a className="link" onClick={() => navigate('/creategig')} style={{ color: 'black', fontWeight: 'bold' }}>Create Gig</a>
        </Link>
        </div>

        <div style={{ marginRight: 20 }}>
        <Link to="/RegisterEmployee">
        <a className="link" onClick={() => navigate('/registeremployee')} style={{ color: 'black', fontWeight: 'bold' }}>Register Associate</a>
        </Link>
        </div>

        <div style={{ marginRight: 20, position: 'absolute', right: 10 }}>
        {/* <Link to="/" style={{ color: 'white', fontSize: 18 }}> */}
        <a onClick={() => logout()} style={{ fontWeight: 'bold', color: 'black' }}>Logout</a>
        {/* </Link> */}
        </div>
        </Box>
    </Toolbar>
  </AppBar>
  );
}