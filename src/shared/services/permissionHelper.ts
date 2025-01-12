import Cookies from "js-cookie";
import PermissionService from "./permissionService";


// Cache permissions in cookies
export const fetchAndCachePermissions = async (token: string, database: string) => {
  const permissionService = new PermissionService(token, database);
  const permissions = await permissionService.getAllPermissions();
  Cookies.set("permissions", JSON.stringify(permissions), { expires: 1 }); // Cache for 1 day
  return permissions;
};

// Get permissions from cookies
export const getPermissionsFromCookies = () => {
  const permissions = Cookies.get("permissions");
  return permissions ? JSON.parse(permissions) : [];
};

// Check if a user has a specific permission
export const hasPermission = (permissionName: string) => {
  const permissions = getPermissionsFromCookies();
  return permissions.some((permission: { name: string }) => permission.name === permissionName);
};