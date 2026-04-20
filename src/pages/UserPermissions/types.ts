export interface PermissionLevel {
  level: number;
  label: string;
  icon: any;
  color: string;
  bg: string;
}

export interface Module {
  id: string;
  label: string;
  icon: any;
  isConfidential?: boolean;
  subItems?: { id: string; label: string; isConfidential?: boolean }[];
}

export interface User {
  id: string;
  name: string;
  position: string;
  email: string;
  avatar: string;
  isDev?: boolean;
  permissions?: string; // JSON string from DB
}
