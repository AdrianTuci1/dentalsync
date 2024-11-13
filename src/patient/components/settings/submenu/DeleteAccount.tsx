import React from 'react';
import { IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface DeleteAccountProps {
  onBack: () => void;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ onBack }) => {
  return (
    <div className="delete-account">
      <div className="header">
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <h2>Delete Account</h2>
      </div>
      <div className="content">
        <p>If you delete your account, all data will be permanently lost. This action cannot be undone.</p>
        <Button variant="contained" color="error">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccount;
