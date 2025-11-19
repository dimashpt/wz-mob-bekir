import { User, UserPermission } from '../user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  auth_token: string;
  expires_in: number;
  roles: string;
  tenant: {
    id: string;
    logo: string;
    name: string;
    plan: string;
  };
  permissions: UserPermission[];
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
