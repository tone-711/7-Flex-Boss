import "./style.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

export default function Register() {
  const [id, setId] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [mobNumber, setMobNumber] = useState("");

  return (
    <div className="Container">
      <div className="Login">
        <h2>Register</h2>
        <TextField
         value={id}
         onChange={(e) => {
           setId(e.target.value);
         }}
          id="outlined-basic"
          label="Employee Id"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
         value={user}
         onChange={(e) => {
           setUser(e.target.value);
         }}
          id="outlined-basic"
          label="Username"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
        value={pass}
        onChange={(e) => {
          setPass(e.target.value);
        }}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
        value={confirmPass}
        onChange={(e) => {
          setConfirmPass(e.target.value);
        }}
          id="outlined-basic"
          label="Confirm Password"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
         value={email}
         onChange={(e) => {
           setEmail(e.target.value);
         }}
          id="outlined-basic"
          label="Email"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
        value={mobNumber}
        onChange={(e) => {
          setMobNumber(e.target.value);
        }}
        type="numeric"
          id="outlined-basic"
          label="Mobile Number"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />

        {!id ||
        !user ||
        !pass ||
        !confirmPass ||
        !email ||
        !mobNumber ? null : (
          <Button
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
          >
            Register
          </Button>
        )}
      </div>
    </div>
  );
}