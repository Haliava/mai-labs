export type Organization = {
  id: number,
  name: string,
}

export type OrganizationSettings = {
  id: number,
  organization_id: number,
  setting_key: string,
  setting_value: string,
}

export type AvailableSettings = {
  maxFlags: number,
  permissionsForNewEmployees: 'all' | 'none',
}

export type Setting = {
  setting_key: string,
  setting_value: string,
}