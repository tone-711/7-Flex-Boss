import './style.css';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

export default function Register() {
  return (
    <div className='Container'>
        <div className='Login'>
        <h2>Register</h2>
        <TextField id="outlined-basic" label="Employee Id" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>
        <TextField id="outlined-basic" label="Username" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>
        <TextField id="outlined-basic" label="Password" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>
        <TextField id="outlined-basic" label="Employee Id" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>
        <TextField id="outlined-basic" label="Confirm Password" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>
        <TextField id="outlined-basic" label="Email" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>
        <TextField id="outlined-basic" label="Mobile Number" variant="outlined" style={{ width: 300, backgroundColor: 'white', marginBottom: 15, borderRadius: 8 }}/>

        <Button variant="contained" style={{ width: 300, marginTop: 10 }}>Register</Button>
        </div>
    </div>
  );
}
