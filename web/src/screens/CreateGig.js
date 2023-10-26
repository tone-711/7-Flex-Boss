import "../style.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

export default function CreateGig() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rate, setRate] = useState("");
  const [headcount, setHeadcount] = useState("");

  return (
    <div className="Container">
      <div className="Login">
        <h2>Create Gig</h2>
        <TextField
         value={startTime}
         onChange={(e) => {
            setStartTime(e.target.value);
         }}
          id="outlined-basic"
          label="Enter Start Time"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
         value={endTime}
         onChange={(e) => {
            setEndTime(e.target.value);
         }}
          id="outlined-basic"
          label="Enter End Time"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
        value={rate}
        onChange={(e) => {
            setRate(e.target.value);
        }}
          id="outlined-basic"
          label="Enter Rate"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />
        <TextField
        value={headcount}
        onChange={(e) => {
            setHeadcount(e.target.value);
        }}
          id="outlined-basic"
          label="Enter Headcount"
          variant="outlined"
          style={{
            width: 300,
            backgroundColor: "white",
            marginBottom: 15,
            borderRadius: 8,
          }}
        />

        {!startTime ||
        !endTime ||
        !rate ||
        !headcount ? null : (
          <Button
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
          >
            Signup
          </Button>
        )}
      </div>
    </div>
  );
}