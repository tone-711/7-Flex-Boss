import "../style.css";
import {Select, MenuItem} from "@mui/material";
import useSocketIO from '../services/useSocketIO'
import { MemoContext } from "../services/MainMemo";
import React, {useEffect, useState, useContext} from 'react';

export default function Addlocation() {
  const { socket } = useSocketIO();
  const [error, setError] = useState(null)
  const [locationData, setLocationData] = useState(null);
  const {setStoreId} = useContext(MemoContext);

    useEffect(() => {
      socket.emit('get all locations');
    }, []);


    socket?.on("get all locations response", ({ success, stores }) => {
      if (success === true) {
        setError(null)
        setLocationData(stores)
      }
      else {
        setError('Refresh to pull all locations')
      }
    });

  return (
    <div className="Container">
      <div className="Login" style={{ justifyContent: 'flex-start' }}>
        <h2>Add Store Location</h2>

<div style={{ backgroundColor: 'white', width: '80%' }}>
        <Select
        sx={{
          width: '100%',
          height: 50,
          color: 'black'
        }}
      >
{locationData?.map((x)=> (
   <MenuItem onClick={setStoreId(x.storeId)} value={x.address}>{x.address} {'('+x.storeId+')'}</MenuItem>
))}
      </Select>
      </div>
      {error ? <p style={{ color: '#ff0028' }}>{error}</p> : null}
      </div>
    </div>
  );
}