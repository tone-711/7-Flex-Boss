import "../style.css";
import logo from '../logo.png';
import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { Link, useLocation } from "wouter";
import useSocketIO from '../services/useSocketIO'
import { MemoContext } from "../services/MainMemo";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState('');
  const [location, navigate] = useLocation();
  const { socket } = useSocketIO();
  const {setToken} = useContext(MemoContext);

      socket?.on("login response", ({ success, token }) => {
        if (success === true) {
          setError('')
          window.sessionStorage.token=token
          setToken(token);
        }
        else {
          setError('Check your credentials')
        }
      });

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
            backgroundColor: '#fcc494',
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
            backgroundColor: '#fcc494',
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        {error ? <p style={{ color: '#ff0028' }}>{error}</p> : null}
        {!user || !pass ? null : (
          <Button
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
            onClick={() => socket.emit("login", { username: user, password: pass })}
          >
            Login
          </Button>
        )}

<Button
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
            onClick={() => navigate('/register')}
          >
            Signup
          </Button>

 {/* <Link href="/Addlocation">
 <a className="link" onClick={() => navigate('/addlocation')}>Profile</a>
 </Link> */}
      </div>
    </div>
  );
}

