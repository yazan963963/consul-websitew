export const PERMISSIONS = [
  "dashboard.view",
  "catalogs.view", "catalogs.create", "catalogs.edit", "catalogs.delete", "catalogs.inventory",
  "warehouses.view", "warehouses.manage",
  "categories.view", "categories.manage",
  "settings.view", "settings.manage",
  "users.view", "users.manage",
] as const;

export type Permission = typeof PERMISSIONS[number];
export type AdminRole = "owner" | "admin" | "editor" | "viewer";

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  owner: [...PERMISSIONS],
  admin: PERMISSIONS.filter((permission)=>permission!=="users.manage"),
  editor: ["dashboard.view","catalogs.view","catalogs.create","catalogs.edit","catalogs.inventory","warehouses.view","categories.view"],
  viewer: ["dashboard.view","catalogs.view","warehouses.view","categories.view"],
};

export function effectivePermissions(role:AdminRole,custom?:string[]|null):Permission[]{
  if(role==="owner")return [...PERMISSIONS];
  const valid=(custom??[]).filter((permission):permission is Permission=>PERMISSIONS.includes(permission as Permission));
  return valid.length?valid:ROLE_PERMISSIONS[role];
}
