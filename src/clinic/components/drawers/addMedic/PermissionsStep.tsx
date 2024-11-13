import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { ApiPermission } from '../../../types/Medic';

interface PermissionsStepProps {
  permissions: ApiPermission[];
  onPermissionsChange: (updatedPermissions: ApiPermission[]) => void;
}

const PermissionsStep: React.FC<PermissionsStepProps> = ({ permissions, onPermissionsChange }) => {
  const handlePermissionChange = (permissionId: number) => {
    const updatedPermissions = permissions.map((permission) =>
      permission.id === permissionId
        ? { ...permission, isEnabled: !permission.isEnabled }
        : permission
    );
    onPermissionsChange(updatedPermissions);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Permissions
      </Typography>
      {permissions.map((permission) => (
        <FormControlLabel
          key={permission.id}
          control={
            <Checkbox
              checked={permission.isEnabled}
              onChange={() => handlePermissionChange(permission.id)}
            />
          }
          label={permission.name}
        />
      ))}
    </Box>
  );
};

export default PermissionsStep;
