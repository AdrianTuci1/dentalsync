// YourProfile.tsx
import React from 'react';
import { Button, TextField, Avatar, Typography } from '@mui/material';
import './YourProfile.scss'

interface YourProfileProps {
  onClose: () => void;
}

const YourProfile: React.FC<YourProfileProps> = ({ onClose }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Avatar src="/path/to/profile/image.jpg" alt="Profile" style={{ width: 80, height: 80, margin: 'auto' }} />
      <Typography variant="h6" align="center" style={{ margin: '20px 0' }}>Your Profile</Typography>
      
      <TextField label="Name" fullWidth defaultValue="Esther Howard" margin="normal" />
      <TextField label="Phone Number" fullWidth defaultValue="603.555.0123" margin="normal" />
      <TextField label="Email" fullWidth defaultValue="example@gmail.com" margin="normal" />
      <TextField label="DOB" fullWidth placeholder="DD/MM/YY" margin="normal" />
      <TextField label="Gender" fullWidth select margin="normal">
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </TextField>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: '20px' }}
        onClick={() => console.log('Profile updated')}
      >
        Update Profile
      </Button>
      
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        style={{ marginTop: '10px' }}
        onClick={onClose} // Close the dialog
      >
        Close
      </Button>
    </div>
  );
};

export default YourProfile;
