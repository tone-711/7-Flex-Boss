import './style.css';
import { Link } from "wouter";
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

export default function Login() {

return (
    <div className='Container'>
        <div className='Login'>
            <h2>7Flex</h2>
           
            <TextField id="outlined-basic" label="Enter Username" variant="outlined" style={{ width: 300, backgroundColor: '#FF9900', marginBottom: 15, borderRadius: 8 }}/>
            <TextField id="outlined-basic" label="Enter Password" variant="outlined" style={{ width: 300, backgroundColor: '#FF9900', marginBottom: 15, borderRadius: 8 }}/>

            <Button 
                variant="contained" 
                style={{ width: 300, marginTop: 10, background: '#000000' }}
                //onClick={() => canLogin()}
            >Login</Button>

    <Link href="/Register">
       <a className="link">Profile</a>
     </Link>
           
        </div>
    </div>
    
    
  );
}
