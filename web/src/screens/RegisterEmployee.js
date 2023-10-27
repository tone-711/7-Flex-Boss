import "../style.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import useSocketIO from '../services/useSocketIO'

export default function RegisterEmployee() {
  const [id, setId] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [mobNumber, setMobNumber] = useState("");
  const { socket } = useSocketIO();
  const [error, setError] = useState(null)
  const [registered, setRegistered] = useState(false)

  socket?.on("register user response", ({ success }) => {
    if (success === true) {
      setError(null)
      setRegistered(true)
    }
    else {
      setError('Try again')
    }
  });

  return (
    <div className="Container">
      <div className="Login" style={{ justifyContent: 'flex-start' }}>
        {registered ? 
        <p>Associate Registered!</p>
        :
        <><h2>Register Associate</h2><TextField
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            } }
            id="outlined-basic"
            label="Employee Id"
            variant="outlined"
            style={{
              width: 300,
              backgroundColor: "white",
              marginBottom: 15,
              borderRadius: 8,
            }} /><TextField
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              } }
              id="outlined-basic"
              label="Username"
              variant="outlined"
              style={{
                width: 300,
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 8,
              }} /><TextField
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              } }
              id="outlined-basic"
              label="Password"
              variant="outlined"
              style={{
                width: 300,
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 8,
              }} /><TextField
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
              } }
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              style={{
                width: 300,
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 8,
              }} /><TextField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              } }
              id="outlined-basic"
              label="Email"
              variant="outlined"
              style={{
                width: 300,
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 8,
              }} /><TextField
              value={mobNumber}
              onChange={(e) => {
                setMobNumber(e.target.value);
              } }
              type="numeric"
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
              style={{
                width: 300,
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 8,
              }} />

        {error ? <p style={{ color: '#ff0028' }}>{error}</p> : null}

        {!id ||
        !user ||
        !pass ||
        !confirmPass ||
        !email ||
        !mobNumber ? null : (
          <Button
          onClick={() => socket.emit("register user", { username: user, password: pass, employeeId: id, email: email, mobilePhone: mobNumber, role: "associate" })}
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
          >
            Register
          </Button>
        )}
        </>
}
      </div>
    </div>
  );
}
