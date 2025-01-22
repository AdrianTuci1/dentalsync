import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
import Cookies from "js-cookie";

interface ApiPermission {
  id: number;
  name: string;
  isEnabled: boolean;
}

interface PermissionsStepProps {
  permissions: { id: number; isEnabled: boolean }[]; // Array of permissions with `id` and `isEnabled`
  onPermissionsChange: (updatedPermissions: { id: number; isEnabled: boolean }[]) => void; // Callback to handle permission updates
}

const PermissionsStep: React.FC<PermissionsStepProps> = ({
  permissions,
  onPermissionsChange,
}) => {
  const [allPermissions, setAllPermissions] = useState<ApiPermission[]>([]);

  useEffect(() => {
    const cachedPermissions = Cookies.get("permissions");
    if (cachedPermissions) {
      const parsedPermissions: ApiPermission[] = JSON.parse(cachedPermissions);

      const mergedPermissions = parsedPermissions.map((perm) => ({
        id: perm.id,
        name: perm.name,
        isEnabled: permissions.find((p) => p.id === perm.id)?.isEnabled ?? false,
      }));

      setAllPermissions(mergedPermissions);
    }
  }, [permissions]);

  const handlePermissionToggle = (permissionId: number) => {
    const updatedPermissions = allPermissions.map((perm) =>
      perm.id === permissionId
        ? { ...perm, isEnabled: !perm.isEnabled }
        : perm
    );

    setAllPermissions(updatedPermissions);
    onPermissionsChange(updatedPermissions);
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
              checked={permission.isEnabled}
              onChange={() => handlePermissionToggle(permission.id)}
            />
          }
          label={permission.name || `Permission ${permission.id}`}
        />
      ))}
    </Box>
  );
};

export default PermissionsStep;