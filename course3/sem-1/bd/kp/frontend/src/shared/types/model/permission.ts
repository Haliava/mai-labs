export type Permission = {
  id: number;
  name: string;
}

export type AccessControls = {
  id: number,
  user_id: number,
  organization_id: number,
  permissions: string,
}

export enum PERMISSIONS {
  ALL = 'all',
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export enum ROLES {
  DEFAULT = 'default',
  ADMIN = 'admin',
}