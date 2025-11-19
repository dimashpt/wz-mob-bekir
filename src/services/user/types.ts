export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  newsletter: boolean;
  global_role: boolean;
  tenant_id: string;
  avatar: string | null;
  status: string;
  role: number;
  role_name: string;
  assigned_stores: unknown[];
  permissions: UserPermission[];
}

export interface UserPermission {
  guard_name: string;
  permission_id: number;
  permission_name: string;
  role_id: number;
  role_name: string;
}
