import { API_BASE_URL } from "@/shared/const/envVars";
import { Flag } from "@/shared/types/model/flag";
import { User } from "@/shared/types/model/user";

export const getFlagsByOrgId = (orgId: number) => {
  return fetch(`${API_BASE_URL}/feature-flags/byOrg/${orgId}`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'GET',
  })
}

export const createFlag = (flag: Flag, user: User) => {
  return fetch(`${API_BASE_URL}/feature-flags`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({...flag, user}),
  })
}

export const editFlag = (flag: Flag, user: User) => {
  return fetch(`${API_BASE_URL}/feature-flags/${flag.id}`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({...flag, user}),
  })
}

export const deleteFlag = (id: number, user: User) => {
  return fetch(`${API_BASE_URL}/feature-flags/${id}`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'DELETE',
    body: JSON.stringify({user}),
  })
}