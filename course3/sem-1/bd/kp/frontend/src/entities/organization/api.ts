import { API_BASE_URL } from "@/shared/const/envVars";
import { Organization, Setting } from "@/shared/types/model/organization";

export const getOrganizations = (): Promise<Organization[]> => {
  return fetch(`${API_BASE_URL}/organizations`, {
    method: 'GET',
  }).then(res => res.json())
}

export const getEmployeesByOrgId = (orgId: number): Promise<number[]> => {
  return fetch(`${API_BASE_URL}/user-organization/organization/${orgId}`, {
    method: 'GET',
  }).then(res => res.json())
}

export const getUserOrgs = (orgId: number): Promise<Organization[]> => {
  return fetch(`${API_BASE_URL}/user-organization/user/${orgId}`, {
    method: 'GET',
  }).then(res => res.json())
}

export const getOrgSettings = (orgId: number): Promise<Setting[]> => {
  return fetch(`${API_BASE_URL}/organization-settings/organization/${orgId}`, {
    method: 'GET',
  }).then(res => res.json())
}

export const updateOrgSettings = (orgId: number, settings: Setting[]) => {
  return Promise.all(settings.map(setting => updateOrgSetting(orgId, setting)))
}

export const updateOrgSetting = (orgId: number, setting: Setting) => {
  return fetch(`${API_BASE_URL}/organization-settings/${orgId}`, {
    method: 'PUT',
    body: JSON.stringify(setting),
  }).then(res => res.json())
}

export const createOrganization = (org: Organization) => {
  return fetch(`${API_BASE_URL}/organizations`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({...org}),
  })
  // return axiosInstanceApi.post('/feature-flags', { ...flag });
}

export const editOrganization = (org: Organization) => {
  return fetch(`${API_BASE_URL}/organizations/${org.id}`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({...org}),
  })
}

export const deleteOrganization = (id: number) => {
  return fetch(`${API_BASE_URL}/organizations/${id}`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'DELETE',
  })
}

export const addUserToOrganization = (orgId: number, userId: number) => {
  return fetch(`${API_BASE_URL}/user-organization/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({organizationId: orgId, userId})
  }).then(res => res.json())
}

export const removeUserFromOrganization = (orgId: number, userId: number) => {
  return fetch(`${API_BASE_URL}/user-organization/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify({organizationId: orgId, userId})
  })
}