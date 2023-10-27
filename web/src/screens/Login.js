import "../style.css";
import logo from '../logo.png';
import { useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link, useLocation } from "wouter";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const {navigate} = useLocation();

  return (
    <div className="Container">
      <div className="Login" style={{ justifyContent: 'center' }}>
       
        <img src={logo} className="Logo"/>

        <TextField
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
          id="outlined-basic"
          label="Enter Username"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "#FF9900",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
          type="password"
          id="outlined-basic"
          label="Enter Password"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "#FF9900",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />

        {!user || !pass ? null : (
          <Button
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
            onClick={() => localStorage.setItem('token', 'ABC')}
          >
            Login
          </Button>
        )}

 <Link href="/Register">
 <a className="link" onClick={() => navigate('/register')}>Profile</a>
 </Link>
      </div>
    </div>
  );
}

