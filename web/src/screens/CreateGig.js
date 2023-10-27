import "../style.css";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { MainContext } from "../store/main";
import { useState, useContext } from "react";
import useSocketIO from '../services/useSocketIO'
import { UTCDateMini, UTCDate } from "@date-fns/utc";

export default function CreateGig() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rate, setRate] = useState("");
  const [headcount, setHeadcount] = useState("");
  const { socket } = useSocketIO();
  const {store} = useContext(MainContext);
  const [error, setError] = useState("");
  let sTime = ''
  let eTime = ''
  const [gigCreated, setGigCreated] = useState(false)

  socket?.on("new shift response", ({ success }) => {
    if (success === true) {
      setError("")
      setGigCreated(true)
    }
    else {
      setError('Please try again')
    }
  });

  const settingStartTime = (prop) => {
    setStartTime(prop.toString())

  }

  const settingEndTime = (prop) => {
    setEndTime(prop.toString())
  }

  const submitFormData=()=>{
    sTime = new UTCDate(startTime).toString();
    eTime = new UTCDate(endTime).toString();
    socket.emit("new shift", { storeId: store.storeId, startDate: sTime, endDate: eTime, payRate: rate, headCount: headcount })
  }

  return (
    <div className="Container">
      <div className="Login" style={{ justifyContent: 'flex-start' }}>
      {gigCreated ? 
  <p>Gig Created!</p>
:<>
        <h2>Create Gig</h2>

        <label for="Start time">Enter Start Time</label><input value={startTime} onChange={(e) => settingStartTime(e.target.value)} type="datetime-local" id="starttime" name="starttime" style={{ marginBottom: 15, padding: 20, borderRadius: 8, width: 250 }} /><label for="End time">Enter End Time</label><input value={endTime} onChange={(e) => settingEndTime(e.target.value)} type="datetime-local" id="endtime" name="endtime" style={{ marginBottom: 25, padding: 20, borderRadius: 8, width: 250 }} /><TextField
            value={rate}
            onChange={(e) => {
              setRate(e.target.value);
            } }
            id="outlined-basic"
            label="Enter Rate"
            variant="outlined"
            style={{
              width: 300,
              backgroundColor: "white",
              marginBottom: 15,
              borderRadius: 8,
            }} /><TextField
              value={headcount}
              onChange={(e) => {
                setHeadcount(e.target.value);
              } }
              id="outlined-basic"
              label="Enter Headcount"
              variant="outlined"
              style={{
                width: 300,
                backgroundColor: "white",
                marginBottom: 15,
                borderRadius: 8,
              }} />

        {error ? <p style={{ color: '#ff0028' }}>{error}</p> : null}

        {!startTime ||
        !endTime ||
        !rate ||
        !headcount ? null : (
          <Button
          onClick={() => submitFormData()}
            variant="contained"
            style={{ width: 300, marginTop: 10, background: "#000000" }}
          >
            Create
          </Button>
        )}
        </>
}
      </div>
    </div>
  );
}