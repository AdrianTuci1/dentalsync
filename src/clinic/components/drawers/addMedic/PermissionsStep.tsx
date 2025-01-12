import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { ApiPermission } from "../../../types/Medic";

interface PermissionsStepProps {
  permissions: number[]; // Array of enabled permission IDs
  onPermissionsChange: (updatedPermissions: number[]) => void; // Callback to return updated permission IDs
}

const PermissionsStep: React.FC<PermissionsStepProps> = ({
  permissions,
  onPermissionsChange,
}) => {
  const [allPermissions, setAllPermissions] = useState<ApiPermission[]>([]); // All permissions from cookies
  const [checkedPermissions, setCheckedPermissions] = useState<number[]>(permissions || []); // Local checked state

  // Load all permissions from cookies on mount
  useEffect(() => {
    const cachedPermissions = Cookies.get("permissions");
    if (cachedPermissions) {
      setAllPermissions(JSON.parse(cachedPermissions));
    } else {
      console.error("No permissions found in cookies");
    }
  }, []);

  // Update local checked permissions when the prop changes
  useEffect(() => {
    setCheckedPermissions(permissions);
  }, [permissions]);

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: number) => {
    const updatedPermissions = checkedPermissions.includes(permissionId)
      ? checkedPermissions.filter((id) => id !== permissionId) // Uncheck
      : [...checkedPermissions, permissionId]; // Check

    setCheckedPermissions(updatedPermissions);
    onPermissionsChange(updatedPermissions); // Return updated IDs
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manage Permissions
      </Typography>
      {allPermissions.map((permission) => (
        <FormControlLabel
          key={permission.id}
          control={
            <Checkbox
              checked={checkedPermissions.includes(permission.id)} // Check only IDs in `permissions` prop
              onChange={() => handlePermissionToggle(permission.id)} // Handle toggle
              disabled={!permissions.includes(permission.id)} // Disable unrelated permissions
            />
          }
          label={permission.name} // Use name from allPermissions
        />
      ))}
    </Box>
  );
};

export default PermissionsStep;