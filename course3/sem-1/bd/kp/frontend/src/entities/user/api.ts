import { API_BASE_URL } from "@/shared/const/envVars"
import { User } from "@/shared/types/model/user"

export const createUser = (body: Omit<User, 'id'>): Promise<User> => {
  return fetch(`${API_BASE_URL}/users`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  }).then(res => res.json())
}

export const getUserByEmailAndPassword = (email: string, password: string) => {
  return fetch(`${API_BASE_URL}/users`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then((users: User[]) => users.find(
      userItem => userItem.email === email && userItem.password === password
    ))
}

export const getUserOrganizations = (userId: number) => {
  return fetch(`${API_BASE_URL}/user-organization/user/${userId}`, {
    method: 'GET',
  })
}
